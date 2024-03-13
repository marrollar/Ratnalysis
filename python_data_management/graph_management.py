import matplotlib.pyplot as plt
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import plotly.io as pio
from plotly.subplots import make_subplots
import sqlite3

pd.options.mode.chained_assignment = None

con = sqlite3.connect("rat_data.db")
cur = con.cursor()

sightings_df = pd.read_sql("SELECT * from sightings", con)
stations_df = pd.read_sql("SELECT * from stations", con)
sightings_df["date_start"] = pd.to_datetime(sightings_df["date_start"])
sightings_df["date_end"] = pd.to_datetime(sightings_df["date_end"])


def plot_station_detailed(station_name=None, station_id=None):
    if not station_name and not station_id:
        print("At least the station name or station id must be given")
        return

    # Check if we have multiple stations with the same name being queried
    if not station_id:
        station_id = stations_df[stations_df["station_name"] == station_name][
            "station_id"
        ].values
        if len(station_id) > 1:
            print(
                "Station name conflict, this station requires a specific ID due to duplicate names"
            )
            return

    # Retrieve station in question and organize columns of interest
    station_data = sightings_df[sightings_df["station_id"] == station_id[0]]
    melted_data = station_data.melt(
        ["station_id", "date_start", "date_end"],
        var_name="sighting_type",
        value_vars=["so_many", "one_or_two", "none"],
    )

    # Draw graph
    fig = px.line(
        melted_data, x="date_end", y="value", color="sighting_type", markers=True
    )
    fig.update_layout(
        title=f"30 Day Trail of Rats Seen at {station_name} ({station_id[0]})",
        xaxis_tickformat="%d %B (%a)<br>%Y",
        yaxis_title="Sighting Count",
    )

    return pio.to_html(fig, include_plotlyjs=False, full_html=False)


def plot_summary():
    # Aggregate data
    nyc_total_sightings = (
        sightings_df.groupby(["date_start", "date_end"])
        .sum(["so_many", "one_or_two", "none"])
        .drop(columns="station_id")
        .reset_index()
    )

    # Organize data
    melted_data = nyc_total_sightings.melt(
        ["date_start", "date_end"],
        var_name="sighting_type",
        value_vars=["so_many", "one_or_two", "none"],
    )

    # Draw graph
    fig = px.line(
        melted_data, x="date_end", y="value", color="sighting_type", markers=True
    )
    fig.update_layout(
        title="30 day Trail of Total Rats Seen",
        xaxis_tickformat="%d %B (%a)<br>%Y",
        yaxis_title="Sighting Count",
    )

    return pio.to_html(fig, include_plotlyjs=False, full_html=False)


def plot_station_summary(station_name=None, station_id=None):
    if not station_name and not station_id:
        print("At least the station name or station id must be given")
        return

    if not station_id:
        station_id = stations_df[stations_df["station_name"] == station_name][
            "station_id"
        ].values
        if len(station_id) > 1:
            print(
                "Station name conflict, this station requires a specific ID due to duplicate names"
            )
            return

    station_data = sightings_df[sightings_df["station_id"] == station_id[0]]
    station_data["total_sightings"] = (
        station_data["so_many"] + station_data["one_or_two"]
    )
    station_data["total_records"] = (
        station_data["so_many"] + station_data["one_or_two"] + station_data["none"]
    )
    station_data["perc_sightings"] = (
        station_data["total_sightings"] / station_data["total_records"]
    )
    station_data = station_data.drop(
        columns=["station_id", "so_many", "one_or_two", "none"]
    )

    station_data["date_delta"] = station_data["date_end"] - station_data[
        "date_end"
    ].shift(1)
    station_data["sightings_delta"] = station_data["total_sightings"] - station_data[
        "total_sightings"
    ].shift(1)
    # station_data["date_delta"] = pd.to_numeric(station_data["date_delta"].dt.days, downcast="integer")
    station_data["date_delta"] = station_data["date_delta"].dt.days

    # melted_data = station_data.melt(
    #     ["station_id", "date_start", "date_end"],
    #     var_name="sighting_type",
    #     value_vars=["so_many", "one_or_two", "none"],
    # )

    # print(melted_data)

    fig = make_subplots(specs=[[{"secondary_y": True}]])

    fig.add_trace(
        go.Scatter(
            x=station_data["date_end"],
            y=station_data["total_sightings"],
            name="Total Sightings",
            mode="lines+markers",
            text=[
                f"date_end: {date.strftime('%d %B (%a)')}"
                for date in station_data["date_end"]
            ],
        ),
        secondary_y=False,
    )

    fig.add_trace(
        go.Scatter(
            x=station_data["date_end"],
            y=station_data["total_records"],
            name="Total Records",
            mode="lines+markers",
            text=[
                f"date_end: {date.strftime('%d %B (%a)')}"
                for date in station_data["date_end"]
            ],
        ),
        secondary_y=False,
    )

    fig.add_trace(
        go.Bar(
            x=station_data["date_end"],
            y=station_data["perc_sightings"],
            name="Percent sightings of total records",
            opacity=0.25,
        ),
        secondary_y=True,
    )

    # fig.add_trace(
    #     go.Scatter(
    #         x=station_data["date_end"],
    #         y=station_data["date_delta"]
    #     )
    # )

    # fig.add_trace(
    #     go.Scatter(
    #         x=station_data["date_end"],
    #         y=station_data["sightings_delta"]
    #     )
    # )

    # fig.update_xaxes(title_text="Date End")
    # fig.update_yaxes(title_text="Count")

    fig.update_layout(
        title_text=f"30 Day Trail of Rat Sightings - {station_name}",
        yaxis=dict(
            title=dict(text="Count"),
            side="left",
        ),
        yaxis2=dict(
            title=dict(text="%"),
            side="right",
            range=[0, 1],
            overlaying="y",
            tickmode="sync",
        ),
    )

    return pio.to_html(fig, include_plotlyjs=False, full_html=False)


