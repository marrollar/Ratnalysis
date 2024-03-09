"use client"

import React from 'react';
import { GoogleMap, LoadScript } from '@react-google-maps/api';
import CircleMarker from '@/app/geomap/CircleMarker';

export default function GoogleMapEmbed({ api_key, station_stats }) {
    const MANHATTAN_COORD = [
        40.7590322,
        -73.99
    ]

    const mapStyles = {
        height: "100%",
        width: "100%"
    };
    const mapOptions = {
        mapTypeId: 'roadmap',
        mapTypeControl: false,
        streetViewControl: false,
        minZoom: 10,
        maxZoom: 20
    };

    return (
        <div className="w-full h-screen flex-1 px-2 ">
            <LoadScript
                googleMapsApiKey={api_key}
            >
                <GoogleMap
                    mapContainerStyle={mapStyles}
                    zoom={14}
                    options={mapOptions}
                    center={{
                        lat: MANHATTAN_COORD[0],
                        lng: MANHATTAN_COORD[1]
                    }}
                >
                    {Object.values(station_stats).map((station, index) => (
                        <CircleMarker
                            key={index}
                            center={{
                                lat: station.latitude,
                                lng: station.longitude,
                            }}
                            radius={station.so_many + station.one_or_two}
                            s_id={station.id}
                            s_name={station.name}
                            s_somany={station.so_many}
                            s_oneortwo={station.one_or_two}
                            s_none={station.none}
                        />
                    ))}
                </GoogleMap>
            </LoadScript>
            {/* <iframe
                title="Google Map"
                className="w-full h-full rounded-lg "
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${api_key}&q=Manhattan`}
            /> */}
        </div>
    )
}