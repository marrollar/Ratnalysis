import os
from datetime import datetime

import pandas as pd
from dateutil.relativedelta import relativedelta

from db import RatnalysisDatabase

data_dir = "rat_data"

db_source = RatnalysisDatabase.get_instance("rat_data.db")
db_source.drop_tables()
db_source.create_tables()


def format_file_names():
    data_files = os.listdir(data_dir)
    formatted_files = []

    # Remove helper sh files
    for file in data_files:
        if file.endswith(".sh"):
            data_files.remove(file)

    # Standardize name of files and remove conflicting ones
    for i, file in enumerate(data_files):
        if file.startswith("rats"):
            date = file.split(" ")[1].split(".")[0]
            dt_end = datetime.strptime(date, "%Y-%m-%d")
            dt_start = dt_end - relativedelta(days=30)

            new_name = f"Transit app rat reports - {dt_start.strftime('%Y-%m-%d')} to {dt_end.strftime('%Y-%m-%d')}.csv"
            old_path = os.path.join("rat_data", file)
            new_path = os.path.join("rat_data", new_name)

            if new_name in data_files:
                print(f"CONFLICT -- {file}, {data_files[data_files.index(new_name)]}")
            else:
                print(f"{old_path} --> {new_path}")
                os.rename(old_path, new_path)
                formatted_files.append(new_name)
        else:
            formatted_files.append(file)

    return sorted(formatted_files)


formatted_files = format_file_names()


def collate_dataset():
    for file in formatted_files:
        if file.endswith(".csv"):
            full_path = os.path.join(data_dir, file)
            tokens = full_path.split(" ")

            date_start = tokens[-3]
            date_end = tokens[-1].split(".")[0]

            rat_sv = pd.read_csv(full_path)
            rat_sv["station_name"] = rat_sv["station_name"].replace(r'\s+', ' ', regex=True)
            print(rat_sv)
            # rat_sv = rat_sv.drop(["lines_served"], axis=1)

            stations_rows = []
            sightings_rows = []

            for index, row in rat_sv.iterrows():
                stations_rows.append(
                    [row["station_id"], row["station_name"], row["lines_served"], None, None]
                )
                sightings_rows.append(
                    [
                        row["station_id"],
                        row["so_many"],
                        row["one_or_two"],
                        row["none"],
                        date_start,
                        date_end,
                    ]
                )

            db_source.insert_stations(stations_rows)
            db_source.insert_sightings(sightings_rows)


collate_dataset()

mta_all_stations = pd.read_csv("MTA_Subway_Stations_20240304.csv")


def insert_latlong():
    cur = db_source.get_cursor()

    station_latlongs = []
    not_found_cnt = 0

    for station_id, station_name, station_lines, _, _ in cur.execute("SELECT * from stations"):
        if "168 St - Washington Hts" in station_name:
            station_name = "168 St-Washington Hts"
        elif "59 St - Columbus Circle" in station_name:
            station_name = "59 St-Columbus Circle"
        elif "Times Sq - 42 St / Port Authority Bus Terminal" in station_name:
            station_name = "42 St-Port Authority Bus Terminal"
        elif "14 St / 6 Av" in station_name or "14 St / 8 Av" in station_name:
            station_name = "14 St"
        elif "South Ferry / Whitehall" in station_name:
            station_name = "Whitehall St-South Ferry"
        elif "149 St - Grand Concourse" in station_name:
            station_name = "149 St-Grand Concourse"
        elif "Chambers St / WTC / Park Place / Cortlandt St" in station_name:
            station_name = "Park Place"
        elif "Borough Hall / Court St" in station_name:
            station_name = "Borough Hall"
        elif "Franklin Av / Botanic Garden" in station_name:
            station_name = "Franklin Av"
        elif "161 St - Yankee Stadium" in station_name:
            station_name = "161 St-Yankee Stadium"
        elif "Lexington Av / 59 St" in station_name:
            station_name = "Lexington Av/59 St"
        elif "Lexington Av / 51 St" in station_name:
            station_name = "51 St"
        elif "Grand Central - 42 St" in station_name:
            station_name = "Grand Central-42 St"
        elif "14 St - Union Sq" in station_name:
            station_name = "14 St-Union Sq"
        elif "Broadway-Lafayette St / Bleecker St" in station_name:
            station_name = "Bleecker St"
        elif "Brooklyn Bridge-City Hall / Chambers St" in station_name:
            station_name = "Brooklyn Bridge-City Hall"
        elif "Jackson Hts-Roosevelt Av / 74 St" in station_name:
            station_name = "Jackson Hts-Roosevelt Av"
        elif "Court Sq - 23 St" in station_name:
            station_name = "Court Sq-23 St"
        elif "42 St - Bryant Pk / 5 Av" in station_name:
            station_name = "42 St-Bryant Pk"
        elif "W 4 St - Wash Sq" in station_name:
            station_name = "W 4 St-Wash Sq"
        elif "Jay St - MetroTech" in station_name:
            station_name = "Jay St-MetroTech"
        elif "62 St / New Utrecht Av" in station_name:
            station_name = "New Utrecht Av"
        elif "34 St - Herald Sq" in station_name:
            station_name = "34 St-Herald Sq"
        elif "Delancey St / Essex St" in station_name:
            station_name = "Delancey St-Essex St"
        elif "4 Av - 9 St" in station_name:
            station_name = "4 Av-9 St"
        elif "Metropolitan Av / Lorimer St" in station_name:
            station_name = "Metropolitan Av"
        elif "Myrtle - Wyckoff Avs" in station_name:
            station_name = "Myrtle-Wyckoff Avs"
        elif "Jamaica Center-Parsons / Archer" in station_name:
            station_name = "Jamaica Center-Parsons/Archer"
        elif "Lexington Av / 63 St" in station_name:
            station_name = "Lexington Av/63 St"
        elif "5 Av / 53 St" in station_name:
            station_name = "5 Av/53 St"
        elif "5 Av / 59 St" in station_name:
            station_name = "5 Av/59 St"

        if station_id == 17763:
            station_lines += " M"

        mta_stations = mta_all_stations[
            (mta_all_stations["Stop Name"] == station_name)
        ]

        found_station = False
        for _, candidate in mta_stations.iterrows():
            if set(candidate["Daytime Routes"]).issubset(set(station_lines)):
                station_latlongs.append(
                    [
                        candidate["GTFS Latitude"],
                        candidate["GTFS Longitude"],
                        station_id,
                    ]
                )
                found_station = True
                break

        if mta_stations.empty or not found_station:
            not_found_cnt += 1
            print(f"{station_id}, {station_name}, {station_lines}: not found")
            print("Candidates:")
            print(
                mta_all_stations[
                    (mta_all_stations["Stop Name"] == f"{station_name}")
                ].to_markdown()
            )
            print()
    print(not_found_cnt)

    db_source.update_latlong(station_latlongs)


insert_latlong()

db_source.close_connection()
