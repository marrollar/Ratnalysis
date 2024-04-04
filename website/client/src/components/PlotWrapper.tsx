
"use client"
import dynamic from "next/dynamic";
import { Config, Layout } from "plotly.js";
const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })

interface PlotlyGraph {
    data: [],
    layout: Partial<Layout>,
    frames: [],
    config: Partial<Config>
}

interface PlotWrapperProps {
    graph: PlotlyGraph
}

export default function PlotWrapper({ graph }: PlotWrapperProps) {
    return (
        <Plot
            data={graph.data}
            layout={graph.layout}
            frames={graph.frames}
            config={graph.config}
            useResizeHandler={true}
            style={{ width: "800px", height: "400px" }}
        />
    );
}