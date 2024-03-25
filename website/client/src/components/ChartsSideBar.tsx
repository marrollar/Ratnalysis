'use client'
import { FetchStationJson } from '@/app/lib/server';
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { shallow } from "zustand/shallow";
import reactFlowStore, { ReactFlowStore } from "./reactFlowStore";
import { ButtonClickEvent } from 'plotly.js';

async function fetchGraph(station_id: string) {
    try {
        const graph_resp = await fetch(`http://127.0.0.1:8080/ps/graphs/${station_id}`, { method: "GET" }).then(x => x.json())
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
    const { appendNode } = reactFlowStore((state: ReactFlowStore) => ({
        appendNode: state.appendNode
    }), shallow)

    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStations, setFilteredStations] = useState<FetchStationJson[]>(station_list);

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

    const handleButtonClick = useCallback(async (event: React.MouseEvent) => {
        const s_id = event.currentTarget.id
        const chart_resp = await fetchGraph(s_id)
        const plotly_json = JSON.parse(chart_resp.pjson)

        appendNode(s_id, plotly_json)
    }, [appendNode])

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
                                    <div>({station.id})</div>
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