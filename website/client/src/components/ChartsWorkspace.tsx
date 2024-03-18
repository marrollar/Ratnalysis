import { useCallback } from 'react';

import ReactFlow, {
    Background,
    Controls,
    MiniMap,
    addEdge,
    useEdgesState,
    useNodesState,
} from 'reactflow';

import ChartNode from './ChartNode';
const nodeTypes = {
    ChartNode
}

import 'reactflow/dist/style.css';

export default function ChartsWorkspace({ in_nodes }) {
    const [nodes, setNodes, onNodesChange] = useNodesState(in_nodes);

    return (
        <div className="grow pt-4 pr-4 pb-4">
            <div className="h-full flex-grow bg-gray-900 border border-gray-500 ">
                <ReactFlow
                    nodes={nodes}
                    nodeTypes={nodeTypes}
                    onNodesChange={onNodesChange}
                >
                    <Controls />
                    <MiniMap />
                    <Background variant="dots" gap={12} size={1} />
                </ReactFlow>
            </div>
        </div>
    )
}