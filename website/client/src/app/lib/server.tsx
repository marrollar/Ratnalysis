
export interface FetchStationJson {
    id: string,
    name: string,
    lines_served: string,
    latitude: string,
    longitude: string
}

export async function fetchStations() {
    try {
        console.log(process.env.NEXT_PUBLIC_ENDPOINT_ROOT)
        const stations_resp = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_ROOT}/rs/stations`, { method: "GET", cache: "no-store" }).then(x => x.json())
        return stations_resp
    } catch (error) {
        console.error("Error retrieving stations: ", error)
        return null
    }
}

export interface FetchLatestRecordJson {
    id: string,
    so_many: string,
    one_or_two: string,
    none: string,
    date_end: string
}

export async function fetchLatestRecords() {
    try {
        const records_resp = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_ROOT}/rs/lastrecords`, { method: "GET", cache: "no-store" }).then(x => x.json())
        return records_resp
    } catch (error) {
        console.error("Error retrieving latest records: ", error)
        return null
    }
}