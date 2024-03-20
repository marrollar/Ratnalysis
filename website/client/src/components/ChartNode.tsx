import dynamic from "next/dynamic";
import { memo } from 'react';
import { NodeResizer } from 'reactflow';
import reactFlowStore from "./reactFlowStore";

const Plot = dynamic(() => import("react-plotly.js"), { ssr: false, })


function ChartNode({ data, selected }) {
    const { deleteNode } = reactFlowStore((state) => ({
        deleteNode: state.deleteNode
    }))

    const handleDelete = () => {
        deleteNode(data.id)
    }

    return (
        <div className="flex flex-grow">
            {/* <NodeResizer color="#ff0071" isVisible={selected} minWidth={100} minHeight={30} /> */}

            <Plot
                data={data.pjson.data}
                layout={data.pjson.layout}
                frames={data.pjson.frames}
                config={data.pjson.config}
                useResizeHandler={true}
                style={{ width: "1000px", height: "400px" }}
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor"
                className="w-8 h-8 absolute bottom-4 right-4 text-black rounded-full p-1 transition duration-100 ease-in-out hover:bg-gray-300 active:bg-gray-400 cursor-pointer"
                onClick={handleDelete}
            >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>

        </div>
    )
}

export default memo(ChartNode)