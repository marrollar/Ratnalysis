"use client"

import CircleMarker from '@/app/geomap/CircleMarker';
import { StationStats } from '@/app/geomap/page';
import { GoogleMap, Libraries, useJsApiLoader } from '@react-google-maps/api';

interface GoogleMapEmbedsProps {
    api_key: string,
    station_stats: Record<string, StationStats>
}

const API_LIBRARIES: Libraries = ["drawing"]

export default function GoogleMapEmbed({ api_key, station_stats }: GoogleMapEmbedsProps) {
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

    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: api_key,
        libraries: API_LIBRARIES,
    });

    return (
        <>
            <div className='w-full'>
                {isLoaded &&
                    <GoogleMap
                        mapContainerStyle={mapStyles}
                        mapContainerClassName=''
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
                                s_id={parseInt(station.id)}
                                s_name={station.name}
                                s_somany={station.so_many}
                                s_oneortwo={station.one_or_two}
                                s_none={station.none}
                            />
                        ))}
                    </GoogleMap>
                }
            </div>
            {/* <iframe
                className='w-full'
                title="Google Map"
                loading="lazy"
                allowFullScreen
                src={`https://www.google.com/maps/embed/v1/place?key=${api_key}&q=Manhattan`}
            /> */}
        </>
    )
}