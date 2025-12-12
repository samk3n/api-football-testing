const apiKey = "QQNFz4STr6Yj83riCpb1dwjFA0VF0eiDwjaaxTAwfyU1EPRtxWeRkZjx5N9g"
const host = "https://api.sportmonks.com/v3/football"
import fs from "fs"

const options = (method = "GET") => {
    return {
        method: method,
        headers: {
            'Authorization': apiKey
        }
    }
};

const response = (endpoint) => {
    return fetch(`${host}${endpoint}`, options())
}

// TEST season 6 team 14
const seasonId = 2058 // 6 (08-09) 14 (07-08) - 2058 (09-10)
const teamId = 3468 // 14 (Man Utd) 3468 (Real Madrid)
const playerId = 580

const allFixturesEndpoint = `/schedules/seasons/${seasonId}/teams/${teamId}`
const fixtureIds = []

const allFixturesrequest = await response(allFixturesEndpoint)
const { data: allFixtures } = await allFixturesrequest.json()

if (allFixtures && allFixtures.length > 0) {

    for (const fixtureObj of allFixtures) {
        if (fixtureObj.rounds) {
            for (const round of fixtureObj.rounds) {
                if (round.fixtures) {
                    for (const fixture of round.fixtures) {
                        fixtureIds.push(fixture.id)
                    }
                }
            }
        }
    }
}

console.log(`Found ${fixtureIds.length} fixtures for team ${teamId} in season ${seasonId}`)

let start = 0
let bench = 0
let totalGoals = 0
let totalAssists = 0
let totalRed = 0
let totalYellow = 0
let totalMinutesPlayed = 0
let count = 0
for (const fixtureId of fixtureIds) {
    const fixtureDetailsEndpoint = `/fixtures/${fixtureId}?include=lineups.type;events.type;events.subtype;statistics.type;participants;stage.type;round;venue.country.continent;venue.city;referees.referee;referees.type;periods;formations;aggregate;group`
    const fixtureDetailsRequest = await response(fixtureDetailsEndpoint)
    const { data } = await fixtureDetailsRequest.json()


    let goals = 0
    let started = false
    let benched = false
    let subbedIn = -1
    let subbedOut = -1
    let subInExtraMinute = 0
    let subOutExtraMinute = 0

    // Check Lineups
    if (data.lineups) {
        for (const lineup of data.lineups) {
            if (lineup.player_id === playerId && lineup.team_id === teamId) {
                if (lineup.type && lineup.type.code == "lineup") {
                    start += 1
                    started = true
                }
                else if (lineup.type && lineup.type.code == "bench") {
                    bench += 1
                    benched = true
                }
            }
        }
    }


    // Check Events
    if (data.events) {
        for (const event of data.events) {
            if (event.result) goals += 1
            if (event.result && event.player_id === playerId) totalGoals += 1
            if (event.result && event.related_player_id === playerId) {
                totalAssists += 1
            }
            if (event.type && event.type.code === "yellowcard" && event.player_id === playerId) totalYellow += 1
            if (event.type && event.type.code === "redcard" && event.player_id === playerId) totalRed += 1
            if (event.type && event.type.code === "yellowredcard" && event.player_id === playerId) {
                totalRed += 1
                totalYellow += 1
            }

            if (event.type_id === 18 && event.type && event.type.code === "substitution") {
                if (event.player_id === playerId) {
                    subbedIn = event.minute || -1
                    subInExtraMinute = event.extra_minute || -1
                }
                else if (event.related_player_id === playerId) {
                    subbedOut = event.minute || -1
                    subOutExtraMinute = event.extra_minute || -1
                }
            }
        }
    }

    // Calculate match length
    let matchPeriodsLength = []
    if (data.periods) {
        for (const period of data.periods) {
            const periodStart = period.started || 0
            const periodEnd = period.ended || -1
            const periodLength = (periodEnd - periodStart) / 60
            matchPeriodsLength.push(periodLength)
        }
    }
    const matchLength = matchPeriodsLength.reduce((a, b) => a + b, 0)

    let minutesPlayed = 0
    if (started) {
        minutesPlayed = subbedOut !== -1 ? subbedOut : matchLength
    }
    else if (benched) {
        if (subbedIn !== -1) {
            if (subbedIn <= 45) {
                minutesPlayed = matchPeriodsLength.slice(1).reduce((a, b) => a + b, 0) + (matchPeriodsLength[0] - (subbedIn + subInExtraMinute))
            }
            else if (subbedIn <= 90) {
                minutesPlayed = matchPeriodsLength.slice(2).reduce((a, b) => a + b, 0) + (matchPeriodsLength[1] - (subbedIn + subInExtraMinute))
            }
            else {
                minutesPlayed = matchPeriodsLength.slice(3).reduce((a, b) => a + b, 0) + (matchPeriodsLength[2] - (subbedIn + subInExtraMinute))
            }
        }
    }
    else {
        minutesPlayed = 0
    }
    totalMinutesPlayed += minutesPlayed

}

console.log(`Lineup: ${start}, Bench: ${bench} - Goals: ${totalGoals} - Assists: ${totalAssists} - Yellow: ${totalYellow} - Red: ${totalRed} - Minutes: ${totalMinutesPlayed}`)
// console.log(count)

// Missing Assists
// at Arsenal (8-11-2008) --> maybe not an assist, deflection
// vs Tottenham (25-04-2009) --> own goal?