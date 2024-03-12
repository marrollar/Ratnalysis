"use client"

import { useState } from "react"
import ChartsSideBar from "./ChartsSideBar"
import ChartsWorkspace from "./ChartsWorkspace"

export default function ChartsPage({ stations }) {
    const [charts, setCharts] = useState({})

    const handleAddNewChart = (station_info) => {
        setCharts(prevCharts => ({
            ...prevCharts,
            [station_info.id]: station_info
        }))
    }

    const handleDeleteChart = (id) => {
        setCharts(prevCharts => {
            const newCharts = { ...prevCharts }
            delete newCharts[id]
            return newCharts
        })
    }

    return (
        <>
            <ChartsSideBar
                station_list={stations}
                handleAddNewChart={handleAddNewChart}
            />
            <ChartsWorkspace
                stations_list={charts}
                handleDeleteChart={handleDeleteChart}
            />
        </>
    )
}