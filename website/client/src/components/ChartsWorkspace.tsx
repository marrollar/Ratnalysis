import { useEffect, useState } from 'react';

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useNodesState,
    useOnViewportChange,
    useReactFlow
} from 'reactflow';

import ChartNode from './ChartNode';
const nodeTypes = {
    ChartNode
}

import 'reactflow/dist/style.css';

function ChartsWorkspaceFlow({ in_nodes }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(in_nodes);
    const [rfInstance, setRFInstance] = useState(null)
    const { setViewport } = useReactFlow();

    useEffect(() => {
        const saved_rf = JSON.parse(sessionStorage.getItem("rf"))
        if (saved_rf) {
            console.log(saved_rf)
            const { x = 0, y = 0, zoom = 1 } = saved_rf.viewport;
            setNodes(saved_rf.nodes || []);
            setViewport({ x, y, zoom });
        }

    }, [setNodes, setViewport])

    useEffect(() => {
        setNodes(in_nodes)
    }, [in_nodes, setNodes])

    useEffect(() => {
        if (rfInstance) {
            const flow = rfInstance.toObject()
            sessionStorage.setItem("rf", JSON.stringify(flow))
        }
    }, [nodes, rfInstance])

    useOnViewportChange({
        onChange: (viewport) => {
            if (rfInstance) {
                const flow = rfInstance.toObject()
                sessionStorage.setItem("rf", JSON.stringify(flow))
            }
        }
    });

    return (
        <div className="grow pt-4 pr-4 pb-4">
            <div className="h-full flex-grow bg-gray-900 border border-gray-500 ">
                <ReactFlow
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    onInit={setRFInstance}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    )
}

export default function CharkWorkspace({ in_nodes }) {
    return (
        <ReactFlowProvider>
            <ChartsWorkspaceFlow in_nodes={in_nodes} />
        </ReactFlowProvider>
    )
}