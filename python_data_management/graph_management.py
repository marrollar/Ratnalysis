import matplotlib.pyplot as plt
import pandas as pd
import plotly.io as pio
import plotly.express as px

def plot_station_trend(station_name, station_id=None):
    if not station_id:
        station_id = stations_df[stations_df["station_name"] == station_name]["station_id"].values
        if len(station_id) > 1:
            print("Station name conflict, this station requires a specific ID due to duplicate names")
            return

    station_data = sightings_df[sightings_df["station_id"] == station_id[0]]
    melted_data = station_data.melt(["station_id", "date_start","date_end"], var_name="sighting_type", value_vars=["so_many", "one_or_two", "none"]) 

    fig = px.line(melted_data, x="date_end", y="value", color="sighting_type", markers=True)
    fig.update_layout(
        title=f"30 day Trail of Rats Seen at {station_name} ({station_id[0]})",
        xaxis_tickformat='%d %B (%a)<br>%Y',
        yaxis_title="Sighting Count"
    )
    
    return pio.to_html(fig, include_plotlyjs=False)

def plot_summary():
    nyc_total_sightings = sightings_df.groupby(["date_start", "date_end"]).sum(["so_many","one_or_two","none"]).drop(columns="station_id").reset_index()
    melted_data = nyc_total_sightings.melt(["date_start","date_end"], var_name="sighting_type", value_vars=["so_many", "one_or_two", "none"]) 

    fig = px.line(melted_data, x="date_end", y="value", color="sighting_type", markers=True)
    fig.update_layout(
        title=f"30 day Trail of Total Rats Seen",
        xaxis_tickformat='%d %B (%a)<br>%Y',
        yaxis_title="Sighting Count"
    )

    return pio.to_html(fig, include_plotlyjs=False)