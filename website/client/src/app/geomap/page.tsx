import { unstable_noStore } from 'next/cache';
import { useEffect, useState, useMemo } from 'react';
import { useLoadScript, GoogleMap, LoadScript } from '@react-google-maps/api';
import GoogleMapEmbed from '@/components/GoogleMapsEmbed';
import { fetchStations, fetchLatestRecords } from '../lib/server';


async function merge_station_records(stations_raw, records_dict) {
    var stats = {}

    for (var i = 0; i < stations_raw.length; i++) {
        var id = stations_raw[i].id
        var name = stations_raw[i].name
        var lines_served = stations_raw[i].lines_served
        var latitude = stations_raw[i].latitude
        var longitude = stations_raw[i].longitude

        var so_many = records_dict[id].so_many
        var one_or_two = records_dict[id].one_or_two
        var none = records_dict[id].none
        var date = records_dict[id].date_end

        stats[id] = {
            id: id,
            name: name,
            lines_served: lines_served,
            latitude: parseFloat(latitude),
            longitude: parseFloat(longitude),
            so_many: parseInt(so_many),
            one_or_two: parseInt(one_or_two),
            none: parseInt(none),
            last_updated: date
        }
    }

    return stats
}

export default async function GoogleMapComponent() {
    const map_api_key = process.env.GOOGLE_MAPS_API_KEY

    const stations_resp = await fetchStations()
    const records_resp = await fetchLatestRecords()

    var records = {}
    for (var i = 0; i < records_resp.records.length; i++) {
        records[records_resp.records[i].id] = records_resp.records[i]
    }

    const station_stats = await merge_station_records(stations_resp.stations, records)

    return (
        <GoogleMapEmbed
            api_key={map_api_key}
            station_stats={station_stats}
        />
    )
};