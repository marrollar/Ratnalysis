import { useEffect, useState } from 'react';

import ReactFlow, {
    Background,
    BackgroundVariant,
    Controls,
    MiniMap,
    ReactFlowProvider,
    useOnViewportChange,
    useReactFlow
} from 'reactflow';
import { shallow } from 'zustand/shallow';

import ChartNode from './ChartNode';
const nodeTypes = {
    ChartNode
}

import 'reactflow/dist/style.css';
import reactFlowStore, { ReactFlowStore } from './reactFlowStore';

function ChartsWorkspaceFlow() {
    const { nodes, rfInstance, viewport, setVP, onNodesChange, setRFInstance } = reactFlowStore((state: ReactFlowStore) => ({
        nodes: state.nodes,
        rfInstance: state.rfInstance,
        viewport: state.viewport,
        setVP: state.setVP,
        onNodesChange: state.onNodesChange,
        setRFInstance: state.setRFInstance,
    }), shallow)
    const { setViewport } = useReactFlow();
    const [nodeCount, setNodeCount] = useState(0)

    // Saves flow to session whenever viewport is changed
    useOnViewportChange({
        onChange: (viewport) => {
            setRFInstance(rfInstance)
            setVP(viewport)
        }
    });

    // Load viewport from storage after component mount
    useEffect(() => {
        setViewport(viewport)
    })

    // useEffect(() => {
    //     const loaded_nodes = nodes.filter((node) => node.data !== null)
    //     setNodeCount(loaded_nodes.length)
    //     console.log(nodes.length)
    // }, [nodes])

    return (
        <div className="grow pt-4 pr-4 pb-4">
            <div className="h-full flex-grow bg-gray-900 border border-gray-500 ">
                <ReactFlow
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    defaultViewport={viewport}
                    attributionPosition='top-right'
                >
                    <Controls />
                    <MiniMap />
                    <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    )
}

export default function CharkWorkspace() {
    return (
        <ReactFlowProvider>
            <ChartsWorkspaceFlow />
        </ReactFlowProvider>
    )
}