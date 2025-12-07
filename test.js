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

