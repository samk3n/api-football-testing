const apiKey = "8febf6371ef8154757be761be656ecf1"
const host = "https://v3.football.api-sports.io"
import fs from "fs"

const options = (method = "GET") => {
    return {
        method: method,
        headers: {
            'x-rapidapi-host': host.replace("https://", ""),
            'x-rapidapi-key': apiKey
        }
    }
};

const response = (endpoint) => {
    return fetch(`${host}${endpoint}`, options())
}
// cr7 874
// messi 154
// zidane 193313
// const ronaldo = await response("/players/teams?player=874")
const ronaldo = await response("/leagues?id=2")
fs.writeFileSync("league1.json", JSON.stringify(await ronaldo.json(), null, 2))
// console.log(await ronaldo.json())