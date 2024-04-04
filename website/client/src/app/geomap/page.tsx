import GoogleMapEmbed from '@/components/GoogleMapsEmbed';
import { FetchLatestRecordJson, FetchStationJson, fetchLatestRecords, fetchStations } from '../lib/server';

export interface StationStats {
    id: string,
    name: string,
    lines_served: string,
    latitude: number,
    longitude: number,
    so_many: number,
    one_or_two: number,
    none: number,
    last_updated: string
}

async function merge_station_records(stations_raw: [FetchStationJson], records_dict: Record<string, FetchLatestRecordJson>) {
    var stats: Record<string, StationStats> = {}

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
        // TODO: Flatten this dictionary to just an array
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
    const map_api_key: string = process.env.GOOGLE_MAPS_API_KEY ? process.env.GOOGLE_MAPS_API_KEY : ""

    const stations_resp = await fetchStations()
    const records_resp = await fetchLatestRecords()

    var records: Record<string, FetchLatestRecordJson> = {}
    for (var i = 0; i < records_resp.records.length; i++) {
        records[records_resp.records[i].id] = records_resp.records[i]
    }

    const station_stats: Record<string, StationStats> = await merge_station_records(stations_resp.stations, records)

    return (
        <GoogleMapEmbed
            api_key={map_api_key}
            station_stats={station_stats}
        />
    )
};