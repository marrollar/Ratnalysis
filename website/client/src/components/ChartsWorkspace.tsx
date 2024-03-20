import { useEffect } from 'react';

import ReactFlow, {
    Background,
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
import reactFlowStore from './reactFlowStore';

function ChartsWorkspaceFlow() {
    const { nodes, rfInstance, viewport, setVP, onNodesChange, setRFInstance } = reactFlowStore((state) => ({
        nodes: state.nodes,
        rfInstance: state.rfInstance,
        viewport: state.viewport,
        setVP: state.setVP,
        onNodesChange: state.onNodesChange,
        setRFInstance: state.setRFInstance,
    }), shallow)
    const { setViewport } = useReactFlow();

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

    return (
        <div className="grow pt-4 pr-4 pb-4">
            <div className="h-full flex-grow bg-gray-900 border border-gray-500 ">
                <ReactFlow
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                    defaultViewport={viewport}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
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