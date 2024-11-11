import React, { useCallback } from 'react';
import ReactFlow, {
  Background,
  Controls,
  ReactFlowProvider,
  Panel,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useStore from './store/useStore';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import ModelNode from './components/nodes/ModelNode';
import ControllerNode from './components/nodes/ControllerNode';
import AppSettingsNode from './components/nodes/AppSettingsNode';

const nodeTypes = {
  model: ModelNode,
  controller: ControllerNode,
  'app-settings': AppSettingsNode,
};

function Flow() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, addNode, appSettings } = useStore();

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = (event.target as Element)
        .closest('.react-flow')
        ?.getBoundingClientRect();

      if (!reactFlowBounds) return;

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      addNode(type, position);
    },
    [addNode]
  );

  return (
    <div className={`flex h-screen ${appSettings.darkMode ? 'dark' : ''}`}>
      <Sidebar />
      <div className="flex-1 h-full bg-white dark:bg-gray-900">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          nodeTypes={nodeTypes}
          fitView
          className="dark:bg-gray-900"
        >
          <Background className="dark:bg-gray-900" />
          <Controls className="dark:bg-gray-800 dark:border-gray-700" />
          <Panel position="top-right">
            <Toolbar />
          </Panel>
        </ReactFlow>
      </div>
    </div>
  );
}

function App() {
  return (
    <ReactFlowProvider>
      <Flow />
    </ReactFlowProvider>
  );
}

export default App;