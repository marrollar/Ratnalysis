'use client'
import { FetchStationJson } from '@/app/lib/server';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { shallow } from "zustand/shallow";
import reactFlowStore, { ReactFlowStore } from "./reactFlowStore";
import { ButtonClickEvent } from 'plotly.js';

const fetch_opts: RequestInit = {
    mode: "cors",
    method: "GET",
    cache: "no-store",
    headers: {
        "Content-Type": "application/json",
        Origin: `${process.env.NEXT_PUBLIC_FRONT_URL}`
    }
}
async function fetchGraph(station_id: string) {
    try {
        // const graph_resp = await fetch(`${process.env.NEXT_PUBLIC_ENDPOINT_ROOT}/ps/graphs/${station_id}`, fetch_opts).then(x => x.json())
        const graph_resp = await fetch(`${process.env.NEXT_PUBLIC_FRONT_URL}/ps/graphs/${station_id}`, fetch_opts).then(x => x.json())
        return graph_resp
    } catch (error) {
        console.error("Error retrieving graph: ", error)
        return null
    }
}

interface ChartsSideBarProps {
    station_list: [FetchStationJson]
}

export default function ChartsSideBar({ station_list }: ChartsSideBarProps) {
    const { nodes, appendNode, appendSkeleton, updateNode } = reactFlowStore((state: ReactFlowStore) => ({
        nodes: state.nodes,
        appendNode: state.appendNode,
        appendSkeleton: state.appendSkeleton,
        updateNode: state.updateNode
    }), shallow)

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStations, setFilteredStations] = useState<FetchStationJson[]>(station_list);
    const [loadingGraphs, setLoadingGraphs] = useState<{ [key: string]: boolean }>({})

    useEffect(() => {
        const filtered = station_list.filter(station =>
            station.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            station.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStations(filtered);
    }, [searchTerm, station_list]);

    const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    // TODO: Try and make it so graph is skeletonized. Related to TODO in ChartNode
    // Current stop gap is to just condtionally render a loading div in the sidebar next to the button based on state
    const updateLoadingStatus = (id: string, isLoading: boolean) => {
        setLoadingGraphs((prevState) => ({
            ...prevState,
            [id]: isLoading
        }))
    }

    const handleButtonClick = useCallback(async (event: React.MouseEvent) => {
        const s_id = event.currentTarget.id
        if (nodes.some((item) => item.id === s_id)) {
            return
        }

        // appendSkeleton(s_id)
        updateLoadingStatus(s_id, true)
        const chart_resp = await fetchGraph(s_id)
        updateLoadingStatus(s_id, false)
        const plotly_json = JSON.parse(chart_resp.pjson)

        // updateNode(s_id, plotly_json)
        appendNode(s_id, plotly_json)
    }, [nodes, appendNode])

    return (
        <>
            <div className='p-4'>
                <div className="flex flex-col h-full overflow-hidden bg-gray-800 text-white w-64 border border-gray-500 p-4">
                    <h2 className="text-2xl font-bold mb-4">Stations</h2>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="Search stations"
                        className="w-full bg-gray-700 text-white rounded-md py-2 px-3 mb-4"
                    />
                    <div className='h-full flex-grow bg-gray-900 overflow-y-auto p-3'>
                        <ul className='h-full flex-grow overflow-auto'>
                            {filteredStations.map((station, index) => (
                                <li key={index} id={station.id} onClick={handleButtonClick}
                                    className="cursor-pointer hover:bg-gray-700 rounded-md py-2 px-4 mb-2"
                                >
                                    <div className='flex'>
                                        <div>({station.id})</div>
                                        {
                                            (station.id in loadingGraphs) &&
                                            loadingGraphs[station.id] &&
                                            <div className='ml-4 text-red-500'>Loading...</div>
                                        }
                                    </div>
                                    <div>{station.name}</div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </>

    )
}