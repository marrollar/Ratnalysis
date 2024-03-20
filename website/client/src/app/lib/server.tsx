export async function fetchStations() {
    try {
        const stations_resp = await fetch(`${process.env.ENDPOINT_ROOT}/rs/stations`, { method: "GET", cache: "no-store" }).then(x => x.json())
        return stations_resp
    } catch (error) {
        console.error("Error retrieving stations: ", error)
        return null
    }
}

export async function fetchLatestRecords() {
    try {
        const records_resp = await fetch(`${process.env.ENDPOINT_ROOT}/rs/lastrecords`, { method: "GET", cache: "no-store" }).then(x => x.json())
        return records_resp
    } catch (error) {
        console.error("Error retrieving latest records: ", error)
        return null
    }
}