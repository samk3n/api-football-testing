const apiKey = "QQNFz4STr6Yj83riCpb1dwjFA0VF0eiDwjaaxTAwfyU1EPRtxWeRkZjx5N9g"
const host = "https://api.sportmonks.com/v3"
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
// Man Utd 14
// Brighton 78
// Auxerre 3682
// Wolfsburg 510

// TEST season 6 team 14

const request = await response(`/football/fixtures/19439431?include=
league;
season;
participants;
lineups.player;
lineups.type;
lineups.position;
events.player;
events.type;
events.subtype;
statistics.type;
stage.type;
round;
venue.country.continent;
venue.city;
referees.referee;
referees.type;
periods;
formations;
aggregate;
group;
coaches;
predictions.type`)
// const request = await response(`/football/teams/search/wolfsburg`)
// const request = await response(`/football/fixtures/between/2025-12-02/2025-12-02/83`)
// const request = await response(`/football/players/407775?include=statistics`)
// const request = await response(`/football/schedules/seasons/6/teams/14`)
// const request = await response(`/core/types`)

const data = await request.json()
// console.log(data)
fs.writeFileSync("test4.json", JSON.stringify(data.data, null, 2))

// Get player career history: /players/580?include=statistics --> Gather team_id & season_id
// Get every fixture id for each team-season pair: /schedules/seasons/{season_id}/teams/{team_id} --> Gather fixtures ids in [rounds[fixtures[{id}]]]
// Get fixture details for each fixture id: /football/fixtures/19439431?include=league;season;participants;lineups.player;lineups.type;lineups.position;events.player;events.type;events.subtype;statistics.type;stage.type;round;venue.country.continent;venue.city;referees.referee;referees.type;periods;formations;aggregate;group;coaches;predictions.type

// TODO
