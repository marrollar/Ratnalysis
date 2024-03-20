import {
    NodeChange,
    applyNodeChanges
} from 'reactflow';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';

const reactFlowStore = createWithEqualityFn(
    persist(
        (set, get) => ({
            nodes: [],
            rfInstance: null,
            viewport: { x: 0, y: 0, zoom: 1 },
            onNodesChange: (changes: NodeChange[]) => {
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
                });
            },
            setRFInstance: (rf) => {
                set({ rfInstance: rf })
            },
            setVP: (vp) => {
                set({ viewport: vp })
            },
            appendNode: (id, data) => {
                set({
                    nodes: [
                        ...get().nodes,
                        {
                            id: id,
                            type: "ChartNode",
                            data: {
                                id: id,
                                pjson: data
                            },
                            position: { x: 100, y: 100 }
                        }
                    ]
                })
            },
            deleteNode: (id) => {
                set((state) => ({ nodes: state.nodes.filter((node) => node.id !== id) }))
            }
        }),
        {
            name: "rf2",
            storage: createJSONStorage(() => sessionStorage)
        }
    )
);

export default reactFlowStore;