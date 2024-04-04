"use server"

export interface FetchStationJson {
    id: string,
    name: string,
    lines_served: string,
    latitude: string,
    longitude: string
}

export async function fetchStations() {
    try {
        const stations_resp = await fetch(`${process.env.ENDPOINT_ROOT}/rs/stations`, fetch_opts).then(x => x.json())
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
        const records_resp = await fetch(`${process.env.ENDPOINT_ROOT}/rs/lastrecords`, fetch_opts).then(x => x.json())
        return records_resp
    } catch (error) {
        console.error("Error retrieving latest records: ", error)
        return null
    }
}

export async function fetchSummary() {
    try {
        const records_resp = await fetch(`${process.env.ENDPOINT_ROOT}/ps/summary`, fetch_opts).then(x => x.json())
        return records_resp
    } catch (error) {
        console.error("Error retrieving latest records: ", error)
        return null
    }
}

const fetch_opts: RequestInit = {
    mode: "cors",
    method: "GET",
    cache: "no-store",
    headers: {
        "Content-Type": "application/json",
        Origin: `${process.env.NEXT_PUBLIC_FRONT_URL}`
    }
}