import ChartsPage from "@/components/ChartsPage";

async function fetchStations() {
    try {
        const stations_resp = await fetch("http://127.0.0.1:8080/rs/stations", { method: "GET", cache: "no-store" }).then(x => x.json())
        return stations_resp
    } catch (error) {
        console.error("Error retrieving stations: ", error)
        return null
    }
}

export default async function Page() {
    const stations_resp = await fetchStations()

    return (
        <ChartsPage stations={stations_resp.stations} />
    )
}