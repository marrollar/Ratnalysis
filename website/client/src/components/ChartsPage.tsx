"use client"

import { FetchStationJson } from "@/app/lib/server";
import ChartsSideBar from "./ChartsSideBar";
import ChartsWorkspace from "./ChartsWorkspace";

interface ChartsPageProps {
    stations: [FetchStationJson]
}

export default function ChartsPage({ stations }: ChartsPageProps) {
    return (
        <>
            <ChartsSideBar station_list={stations} />
            <ChartsWorkspace />
        </>
    )
}