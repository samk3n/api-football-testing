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
const seasonId = 6
const teamId = 14
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
for(const fixtureId of fixtureIds) {
    const fixtureDetailsEndpoint = `/fixtures/${fixtureId}?include=lineups.type;events.type;events.subtype;statistics.type;participants;stage.type;round;venue;referees.referee;referees.type;periods;formations;aggregate;group`
    const fixtureDetailsRequest = await response(fixtureDetailsEndpoint)
    const {data} = await fixtureDetailsRequest.json()

    let goals = 0

    // Check Lineups
    if(data.lineups) {
        for(const lineup of data.lineups) {
            if(lineup.player_id === playerId && lineup.team_id === teamId) {
                if(lineup.type && lineup.type.code == "lineup") start += 1
                if(lineup.type && lineup.type.code == "bench") bench += 1
            }
        }
    }

    // Check Events
    if(data.events) {
        for(const event of data.events) {
            if(event.result) goals +=1
            if(event.result && event.player_id === playerId) totalGoals += 1
            if(event.result && event.related_player_id === playerId) {
                totalAssists += 1
                console.log(`${data.name} - ${data.starting_at}`)
            }
            if(event.type && event.type.code === "yellowcard" && event.player_id === playerId) totalYellow += 1
            if(event.type && event.type.code === "redcard" && event.player_id === playerId) totalRed += 1
            if(event.type && event.type.code === "yellowredcard" && event.player_id === playerId) {
                totalRed += 1
                totalYellow += 1
            }
        }
    }

    // console.log(`${data.name} - ${goals} goals`)   

}
console.log(`Lineup: ${start}, Bench: ${bench} - Goals: ${totalGoals} - Assists: ${totalAssists} - Yellow: ${totalYellow} - Red: ${totalRed}`)

// Missing Assists
// at Arsenal (8-11-2008) --> maybe not an assist, deflection
// vs Tottenham (25-04-2009) --> own goal?