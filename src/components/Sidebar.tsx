import React from 'react';
import { Database, Layout, Command } from 'lucide-react';

const Sidebar = () => {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white border-r border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">EXI.AI Components</h2>
      <div className="space-y-4">
        <div
          className="flex items-center p-2 bg-blue-50 rounded-lg cursor-move hover:bg-blue-100 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, 'model')}
        >
          <Database className="h-5 w-5 text-blue-500 mr-2" />
          <span>Model</span>
        </div>
        <div
          className="flex items-center p-2 bg-green-50 rounded-lg cursor-move hover:bg-green-100 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, 'view')}
        >
          <Layout className="h-5 w-5 text-green-500 mr-2" />
          <span>View</span>
        </div>
        <div
          className="flex items-center p-2 bg-purple-50 rounded-lg cursor-move hover:bg-purple-100 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, 'controller')}
        >
          <Command className="h-5 w-5 text-purple-500 mr-2" />
          <span>Controller</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;