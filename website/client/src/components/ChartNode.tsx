import dynamic from "next/dynamic";
import { memo } from 'react';
import { NodeResizer } from 'reactflow';

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })


function ChartNode({ data, selected }) {
    console.log(data)
    return (
        <>
            <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} />
            <Plot
                data={data.pjson.data}
                layout={data.pjson.layout}
                frames={data.pjson.frames}
                config={data.pjson.config}
                useResizeHandler={true}
            />
        </>
    )
}

export default memo(ChartNode)