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

export default function ChartsPage({ stations }) {
    const [charts, setCharts] = useState({})
    // const [graphHTMLS, setGraphHTMLS] = useState({})

    const handleAddNewChart = async (station_info) => {
        // setCharts(prevCharts => ({
        //     ...prevCharts,
        //     [station_info.id]: station_info
        // }))

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

    // Object.entries(charts).map(([s_id, chart_info]) => (
    //     console.log(chart_info.pjson.layout)
    // ))

    return (
        <>
            <ChartsSideBar
                station_list={stations}
                handleAddNewChart={handleAddNewChart}
            />
            <ChartsWorkspace>
                {Object.entries(charts).map(([s_id, chart_info]) => (
                    <div key={s_id} className="p-2 w-full">
                        <Plot
                            data={chart_info.pjson.data}
                            layout={chart_info.pjson.layout}
                            frames={chart_info.pjson.frames}
                            config={chart_info.pjson.config}
                            useResizeHandler={true}
                            style={{width:"100%", height:"300px"}}
                        />
                    </div>
                ))}
            </ChartsWorkspace>
        </>
    )
}