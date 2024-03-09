import { unstable_noStore } from 'next/cache';
import { useEffect, useState, useMemo } from 'react';
import { useLoadScript, GoogleMap, LoadScript } from '@react-google-maps/api';
import GoogleMapEmbed from '@/components/GoogleMapsEmbed';

async function fetchStations() {
    try {
        const stations_resp = await fetch("http://127.0.0.1:8080/stations", { method: "GET", cache: "no-store" }).then(x => x.json())
        return stations_resp
    } catch (error) {
        console.error("Error retrieving stations: ", error)
        return null
    }
}

export default async function GoogleMapComponent() {
    const map_api_key = process.env.GOOGLE_MAPS_API_KEY
    const stations_resp = await fetchStations()

    // const { Map } = await google.maps.importLibrary("maps") as google.maps.MapsLibrary;

    return (
        // <div className="w-full h-5/6 px-2.5 flex justify-center items-center ">
        //     <iframe
        //         className='w-full h-full rounded-lg shadow-lg border border-gray-500'
        //         allowFullScreen
        //         loading="lazy"
        //         src={`https://www.google.com/maps/embed/v1/place?key=${map_api_key}&q=Manhattan`}
        //         >
        //     </iframe>
        // </div>
        // <div className="w-full h-screen flex-1 px-2 ">
        //     <iframe
        //         title="Google Map"
        //         className="w-full h-full rounded-lg "
        //         loading="lazy"
        //         allowFullScreen
        //         src={`https://www.google.com/maps/embed/v1/place?key=${map_api_key}&q=Manhattan`}
        //     />
        // </div>
        <GoogleMapEmbed
            api_key={map_api_key}
            stations={stations_resp.stations}
        />
    )
};