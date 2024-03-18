"use client"

import { useEffect, useState, useCallback } from "react";
import ChartsSideBar from "./ChartsSideBar";
import ChartsWorkspace from "./ChartsWorkspace";



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
    return data !== null ? JSON.parse(data) : []
}

const initialNodes = [];

export default function ChartsPage({ stations }) {
    const [charts, setCharts] = useState(() => sessionLoad("charts"))

    const handleAddNewChart = useCallback(async (station_info) => {
        const chart_resp = await fetchGraph(station_info.id)
        const plotly_json = JSON.parse(chart_resp.pjson)

        setCharts(prevCharts => {
            return [
                ...prevCharts,
                {
                    id: station_info.id,
                    type: "ChartNode",
                    data: {
                        pjson: plotly_json
                    },
                    position: { x: 100, y: 100 }
                }
            ]
        })
    }, [])

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

    useEffect(() => {
        sessionLoad("charts")
    }, []);

    return (
        <>
            <ChartsSideBar
                station_list={stations}
                handleAddNewChart={handleAddNewChart}
            />
            <ChartsWorkspace
                in_nodes={charts}
            >

            </ChartsWorkspace>

        </>
    )
}