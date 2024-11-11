import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { ComponentType } from '../types';

interface TechStack {
  id: string;
  name: string;
  files: {
    path: string;
    content: string;
  }[];
  dependencies: {
    dependencies: Record<string, string>;
    devDependencies: Record<string, string>;
  };
}

interface AppSettings {
  name: string;
  title: string;
  description: string;
  icon: string;
  theme: {
    primary: string;
    secondary: string;
  };
  darkMode: boolean;
  techStack?: TechStack;
}

interface FlowState {
  nodes: Node[];
  edges: Edge[];
  components: ComponentType[];
  generatedFiles: Record<string, string>;
  appSettings: AppSettings;
  isToolbarOpen: boolean;
  addNode: (type: string, position: { x: number; y: number }) => void;
  onNodesChange: (changes: any) => void;
  onEdgesChange: (changes: any) => void;
  onConnect: (connection: Connection) => void;
  updateComponent: (id: string, data: Partial<ComponentType>) => void;
  updateAppSettings: (settings: Partial<AppSettings>) => void;
  toggleDarkMode: () => void;
  toggleToolbar: () => void;
  generateFiles: () => void;
  getConnectedNodes: (nodeId: string, sourceType: string) => Node[];
  getRoutes: () => { path: string; component: string }[];
  getModelInterfaces: (controllerId: string) => { name: string; interface: string }[];
}

const useStore = create<FlowState>()(
  persist(
    (set, get) => ({
      nodes: [],
      edges: [],
      components: [],
      generatedFiles: {},
      isToolbarOpen: false,
      appSettings: {
        name: 'ai-mvc-app',
        title: 'AI MVC Application',
        description: 'A modern MVC application built with AI',
        icon: '/vite.svg',
        theme: {
          primary: '#6366f1',
          secondary: '#8b5cf6',
        },
        darkMode: false,
      },
      
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
              name: `AI${type.charAt(0).toUpperCase() + type.slice(1)}`,
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
        set(state => ({
          nodes: state.nodes.map(node => {
            if (node.id === id) {
              return {
                ...node,
                data: {
                  ...node.data,
                  label: data.name || node.data.label,
                  component: {
                    ...node.data.component,
                    ...data,
                  },
                },
              };
            }
            return node;
          }),
          components: state.components.map(comp =>
            comp.id === id ? { ...comp, ...data } : comp
          ),
        }));
      },

      updateAppSettings: (settings: Partial<AppSettings>) => {
        set(state => ({
          appSettings: { ...state.appSettings, ...settings }
        }));
      },

      toggleDarkMode: () => {
        set(state => ({
          appSettings: {
            ...state.appSettings,
            darkMode: !state.appSettings.darkMode
          }
        }));
      },

      toggleToolbar: () => {
        set(state => ({ isToolbarOpen: !state.isToolbarOpen }));
      },

      getConnectedNodes: (nodeId: string, sourceType: string) => {
        const edges = get().edges;
        const nodes = get().nodes;
        
        return nodes.filter(node => 
          edges.some(edge => 
            edge.target === nodeId && 
            edge.source === node.id && 
            node.type === sourceType
          )
        );
      },

      getModelInterfaces: (controllerId: string) => {
        const connectedModels = get().getConnectedNodes(controllerId, 'model');
        return connectedModels.map(model => {
          const interfaceMatch = model.data.component.code.match(/interface\s+(\w+)\s*{[^}]+}/);
          return interfaceMatch ? {
            name: interfaceMatch[1],
            interface: interfaceMatch[0]
          } : null;
        }).filter(Boolean);
      },

      getRoutes: () => {
        const nodes = get().nodes;
        const edges = get().edges;
        const routes: { path: string; component: string }[] = [];

        nodes
          .filter(node => node.type === 'controller')
          .forEach(controller => {
            const connectedModels = get().getConnectedNodes(controller.id, 'model');
            if (connectedModels.length > 0) {
              const routePath = `/${controller.data.component.name.toLowerCase()}`;
              routes.push({
                path: routePath,
                component: controller.data.component.name,
              });
            }
          });

        return routes;
      },

      generateFiles: () => {
        const { nodes, appSettings, getRoutes } = get();
        const files: Record<string, string> = {};

        // Add tech stack files if selected
        if (appSettings.techStack) {
          appSettings.techStack.files.forEach(file => {
            files[file.path] = file.content;
          });
        }

        // Generate model files
        nodes
          .filter(node => node.type === 'model')
          .forEach(node => {
            const { component } = node.data;
            files[`src/models/${component.name}.ts`] = component.code;
          });

        // Generate controller files with integrated views
        nodes
          .filter(node => node.type === 'controller')
          .forEach(node => {
            const { component } = node.data;
            files[`src/components/${component.name}/${component.name}.tsx`] = component.code;
          });

        // Generate router if it exists
        const routerNode = nodes.find(node => node.type === 'router');
        if (routerNode) {
          files['src/router/index.tsx'] = routerNode.data.component.code;
        }

        set({ generatedFiles: files });
      },
    }),
    {
      name: 'ai-mvc-storage',
      partialize: (state) => ({
        appSettings: state.appSettings,
      }),
    }
  )
);

export default useStore;