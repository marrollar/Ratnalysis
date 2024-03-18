"use client"

import { useState, useEffect } from "react"
import ChartsSideBar from "./ChartsSideBar"
import ChartsWorkspace from "./ChartsWorkspace"
import dynamic from "next/dynamic";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })


async function fetchGraph(station_id) {
    try {
        const graph_resp = await fetch(`http://127.0.0.1:8080/ps/graphs/${station_id}`, { method: "GET" }).then(x => x.json())
        return graph_resp
    } catch (error) {
        console.error("Error retrieving graph: ", error)
        return null
    }
}

function sessionLoad(key) {
    const data = sessionStorage.getItem(key)
    return data !== null ? JSON.parse(data) : {}
}

export default function ChartsPage({ stations }) {
    const [charts, setCharts] = useState(() => sessionLoad("charts"))

    const handleAddNewChart = async (station_info) => {
        const chart_resp = await fetchGraph(station_info.id)
        setCharts(prevCharts => ({
            ...prevCharts,
            [station_info.id]: {
                ...station_info,
                pjson: JSON.parse(chart_resp.pjson)
            }
        }))
    }


    const handleDeleteChart = (id) => {
        setCharts(prevCharts => {
            const newCharts = { ...prevCharts }
            delete newCharts[id]
            return newCharts
        })
    }

    useEffect(() => {
        sessionStorage.setItem("charts", JSON.stringify(charts))
    }, [charts])

    return (
        <>
            <ChartsSideBar
                station_list={stations}
                handleAddNewChart={handleAddNewChart}
            />
            <ChartsWorkspace>

            </ChartsWorkspace>
        </>
    )
}