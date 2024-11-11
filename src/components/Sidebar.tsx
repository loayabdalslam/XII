import React from 'react';
import { Database, Command, Settings } from 'lucide-react';
import useStore from '../store/useStore';

const Sidebar = () => {
  const { appSettings } = useStore();
  
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">EXI.AI Components</h2>
      <div className="space-y-4">
        <div
          className="flex items-center p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg cursor-move hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, 'model')}
        >
          <Database className="h-5 w-5 text-blue-500 dark:text-blue-400 mr-2" />
          <span className="dark:text-gray-200">Model</span>
        </div>
        <div
          className="flex items-center p-2 bg-purple-50 dark:bg-purple-900/30 rounded-lg cursor-move hover:bg-purple-100 dark:hover:bg-purple-900/50 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, 'controller')}
        >
          <Command className="h-5 w-5 text-purple-500 dark:text-purple-400 mr-2" />
          <span className="dark:text-gray-200">Controller + View</span>
        </div>
        <div
          className="flex items-center p-2 bg-amber-50 dark:bg-amber-900/30 rounded-lg cursor-move hover:bg-amber-100 dark:hover:bg-amber-900/50 transition-colors"
          draggable
          onDragStart={(e) => onDragStart(e, 'app-settings')}
        >
          <Settings className="h-5 w-5 text-amber-500 dark:text-amber-400 mr-2" />
          <span className="dark:text-gray-200">App Settings</span>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;