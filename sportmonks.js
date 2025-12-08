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

// CR7 580
// ZZ 407775
// Saudi Pro League 25/25 26276
// Real Madrid 3468 -- 400009 (vs Ath. Bilbao 2014-10-05)
// Napoli 597 (vs Cagliari 2025-12-03 19586628)
// Holstein Kiel 3611
// Barca 83
// France 18647
// Bayern 503
// PSG 591

// TEST season 6 team 14

// const request = await response(`/fixtures/19433865?include=lineups.type;events.type;events.subtype;statistics.type;participants;stage.type;round;venue;referees.referee;referees.type;periods;formations;aggregate;group`)
const request = await response(`/teams/search/manchester%20united`)
// const request = await response(`/fixtures/between/2025-12-06/2025-12-06/591`)
// const request = await response(`/players/580?include=statistics.details.type`)
// const request = await response(`/schedules/seasons/6/teams/14`)

const data = await request.json()
console.log(data)
// fs.writeFileSync("test3.json", JSON.stringify(data.data, null, 2))

// Get player career history: /players/580?include=statistics --> Gather team_id & season_id
// Get every fixture id for each team-season pair: /schedules/seasons/{season_id}/teams/{team_id} --> Gather fixtures ids in [rounds[fixtures[{id}]]]
// Get fixture details for each fixture id: /fixtures/{fixture_id}?include=lineups;events.type;events.subtype;statistics.type;participants;stage.type;round;venue;referees.referee;referees.type;periods;formations;aggregate

// TODO
