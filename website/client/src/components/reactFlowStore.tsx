import {
    Node,
    NodeChange,
    ReactFlowInstance,
    Viewport,
    applyNodeChanges
} from 'reactflow';
import { createJSONStorage, persist } from 'zustand/middleware';
import { createWithEqualityFn } from 'zustand/traditional';
import { produce } from 'immer';

export interface ChartData {
    id: string,
    type: string,
    data: {
        id: number,
        pjson: {}
    },
    position: {
        x: number,
        y: number
    }
}

// TODO: Make the data array in appendNode more precisely typed
export interface ReactFlowStore {
    nodes: Node[],
    rfInstance: ReactFlowInstance | null,
    viewport: { x: number, y: number, zoom: number },
    onNodesChange: (changes: NodeChange[]) => void,
    setRFInstance: (rf: ReactFlowInstance | null) => void,
    setVP: (vp: Viewport) => void,
    appendNode: (id: string, data: []) => void,
    appendSkeleton: (id: string) => void,
    updateNode: (id: string, data: []) => void,
    deleteNode: (id: string) => void
}

const MAX_X_JITTER = 500
const MAX_Y_JITTER = 300

const reactFlowStore = createWithEqualityFn(
    persist<ReactFlowStore>(
        (set, get) => ({
            nodes: [],
            rfInstance: null,
            viewport: { x: 0, y: 0, zoom: 1 },
            onNodesChange: (changes: NodeChange[]) => {
                set({
                    nodes: applyNodeChanges(changes, get().nodes),
                });
            },
            setRFInstance: (rf: ReactFlowInstance | null) => {
                set({ rfInstance: rf })
            },
            setVP: (vp: Viewport) => {
                set({ viewport: vp })
            },
            appendNode: (id: string, data: []) => {
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
                            position: {
                                x: 100 + (Math.random() * MAX_X_JITTER),
                                y: 100 + (Math.random() * MAX_Y_JITTER)
                            }
                        }
                    ]
                })
            },
            appendSkeleton: (id: string) => {
                set({
                    nodes: [
                        ...get().nodes,
                        {
                            id: id,
                            type: "ChartNode",
                            data: null,
                            position: {
                                x: 100 + (Math.random() * MAX_X_JITTER),
                                y: 100 + (Math.random() * MAX_Y_JITTER)
                            }
                        }
                    ]
                })
            },
            updateNode: (id: string, data: []) => {
                set((state) =>
                    produce(state, (draft) => {
                        const itemToUpdate = draft.nodes.find((item) => item.id === id);
                        if (itemToUpdate) {
                            itemToUpdate.data = {
                                id: id,
                                pjson: data
                            }
                        }
                    }))
            },
            deleteNode: (id: string) => {
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