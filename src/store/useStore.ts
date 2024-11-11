import { create } from 'zustand';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { ComponentType, TodoItem } from '../types';

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  components: ComponentType[];
  generatedFiles: Record<string, string>;
  addNode: (type: string, position: { x: number; y: number }) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  updateComponent: (id: string, data: Partial<ComponentType>) => void;
  generateFiles: () => void;
  getConnectedNode: (nodeId: string, sourceType: string) => Node | undefined;
}

const useStore = create<FlowState>((set, get) => ({
  nodes: [],
  edges: [],
  components: [],
  generatedFiles: {},
  
  addNode: (type, position) => {
    const nodeId = `${type}-${Date.now()}`;
    const componentId = `component-${Date.now()}`;
    
    const newNode: Node = {
      id: nodeId,
      type,
      position,
      data: { 
        label: `New ${type}`,
        component: {
          id: componentId,
          type: type as ComponentType['type'],
          name: `New${type.charAt(0).toUpperCase() + type.slice(1)}`,
          code: '',
        },
        onCodeChange: (code: string) => {
          get().updateComponent(nodeId, { code });
        }
      },
      dragHandle: '.drag-handle',
    };
    
    set({
      nodes: [...get().nodes, newNode],
      components: [...get().components, newNode.data.component],
    });
  },

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  onConnect: (connection) => {
    if (!connection.source || !connection.target) return;
    set({
      edges: addEdge(connection, get().edges),
    });
  },

  updateComponent: (id: string, data: Partial<ComponentType>) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === id
          ? {
              ...node,
              data: {
                ...node.data,
                component: { ...node.data.component, ...data },
              },
            }
          : node
      ),
    });
  },

  getConnectedNode: (nodeId: string, sourceType: string) => {
    const edges = get().edges;
    const nodes = get().nodes;
    
    const connectedEdge = edges.find(edge => 
      (edge.target === nodeId && nodes.find(n => n.id === edge.source)?.type === sourceType)
    );
    
    if (!connectedEdge) return undefined;
    
    return nodes.find(node => node.id === connectedEdge.source);
  },

  generateFiles: () => {
    const files: Record<string, string> = {};
    get().nodes.forEach((node) => {
      const { component } = node.data;
      files[`${component.type}/${component.name}.ts`] = component.code;
    });
    set({ generatedFiles: files });
  },
}));

export default useStore;