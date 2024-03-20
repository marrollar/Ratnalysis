"use client"

import ChartsSideBar from "./ChartsSideBar";
import ChartsWorkspace from "./ChartsWorkspace";

export default function ChartsPage({ stations }) {
    return (
        <>
            <ChartsSideBar station_list={stations} />
            <ChartsWorkspace />
        </>
    )
}