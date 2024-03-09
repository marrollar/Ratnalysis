"use client"

import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import CircleMarker from '@/app/geomap/CircleMarker';



export default function GoogleMapEmbed({ api_key, stations }) {
    const MANHATTAN_COORD = [
        40.7591621,
        -74.0518023
    ]

    const mapStyles = {
        height: "100%",
        width: "100%"
    };
    const mapOptions = {
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl: false
    };

    return (
        <div className="w-full h-screen flex-1 px-2 ">
            {/* <LoadScript
                googleMapsApiKey={api_key}
            >
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={10}
                    options={mapOptions}
                    center={{
                        lat: MANHATTAN_COORD[0],
                        lng: MANHATTAN_COORD[1]
                    }}
                >
                    {stations.map((station, index) => (
                        <CircleMarker
                            key={index}
                            center={{
                                lat: parseFloat(station.latitude),
                                lng: parseFloat(station.longitude)
                            }}
                            radius={1}
                        />
                    ))}
                </GoogleMap>
            </LoadScript> */}
            <iframe
                title="Google Map"
                className="w-full h-full rounded-lg "
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${api_key}&q=Manhattan`}
            />
        </div>
    )
}