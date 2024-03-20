export async function fetchStations() {
    try {
        const stations_resp = await fetch("http://127.0.0.1:8080/stations", { method: "GET", cache: "no-store" }).then(x => x.json())
        return stations_resp
    } catch (error) {
        console.error("Error retrieving stations: ", error)
        return null
    }
}

export async function fetchLatestRecords() {
    try {
        const records_resp = await fetch("http://127.0.0.1:8080/lastrecords", { method: "GET", cache: "no-store" }).then(x => x.json())
        return records_resp
    } catch (error) {
        console.error("Error retrieving latest records: ", error)
        return null
    }
}