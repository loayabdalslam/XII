import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Node, Edge, Connection, addEdge, applyNodeChanges, applyEdgeChanges } from 'reactflow';
import { ComponentType } from '../types';

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
        const routes = getRoutes();

        // Generate model files
        nodes
          .filter(node => node.type === 'model')
          .forEach(node => {
            const { component } = node.data;
            files[`models/${component.name}.ts`] = component.code;
          });

        // Generate controller files with integrated views
        nodes
          .filter(node => node.type === 'controller')
          .forEach(node => {
            const { component } = node.data;
            files[`components/${component.name}/${component.name}.tsx`] = component.code;
          });

        // Generate router
        if (routes.length > 0) {
          const routerContent = `
import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
${routes.map(route => `import { ${route.component} } from '../components/${route.component}/${route.component}';`).join('\n')}

const AppRouter: React.FC = () => {
  return (
    <BrowserRouter>
      <nav className="bg-${appSettings.theme.primary} text-white p-4">
        <div className="container mx-auto flex items-center space-x-4">
          <Link to="/" className="text-xl font-bold">${appSettings.title}</Link>
          <div className="flex space-x-4">
            ${routes.map(route => `
              <Link 
                to="${route.path}"
                className="hover:text-${appSettings.theme.secondary} transition-colors"
              >
                ${route.component.replace(/([A-Z])/g, ' $1').trim()}
              </Link>
            `).join('')}
          </div>
        </div>
      </nav>

      <main className="container mx-auto p-4">
        <Routes>
          ${routes.map(route => `
            <Route 
              path="${route.path}" 
              element={<${route.component} />} 
            />
          `).join('')}
        </Routes>
      </main>
    </BrowserRouter>
  );
};

export default AppRouter;`;

          files['router/AppRouter.tsx'] = routerContent;
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