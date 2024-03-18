"use client"

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import ChartsSideBar from "./ChartsSideBar";
import ChartsWorkspace from "./ChartsWorkspace";
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

// const initialNodes = [
//     { id: '1', position: { x: 0, y: 0 }, data: { label: '1' } },
//     { id: '2', position: { x: 0, y: 100 }, data: { label: '2' } },
// ];
// const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

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
                // in_nodes={initialNodes}
                // in_edges={initialEdges}
            >

            </ChartsWorkspace>

        </>
    )
}