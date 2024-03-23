import ChartsPage from "@/components/ChartsPage";
import { fetchStations } from "../lib/server";

export default async function Page() {
    const stations_resp = await fetchStations()

    return (
        <ChartsPage stations={stations_resp.stations} />
    )
}