'use client'
import React, { useRef, useState, useEffect } from 'react';

export default function ChartsSideBar({ station_list }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStations, setFilteredStations] = useState(station_list);
    
    useEffect(() => {
        const filtered = station_list.filter(station =>
            station.id.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            station.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredStations(filtered);
    }, [searchTerm, station_list]);

    const handleSearchChange = event => {
        setSearchTerm(event.target.value);
    };

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
                    <div className='h-full flex-grow bg-gray-900 overflow-y-auto '>
                        <ul className='h-full flex-grow overflow-auto'>
                            {filteredStations.map((station, index) => (
                                <li key={index} className="cursor-pointer hover:bg-gray-700 rounded-md py-2 px-4 mb-2">
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