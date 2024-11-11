import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings } from 'lucide-react';
import EditableLabel from '../EditableLabel';
import useStore from '../../store/useStore';

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

const techStacks: TechStack[] = [
  {
    id: 'vite-react',
    name: 'Vite + React + TypeScript',
    files: [
      {
        path: 'vite.config.ts',
        content: `import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})`
      },
      {
        path: 'tsconfig.json',
        content: `{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}`
      }
    ],
    dependencies: {
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0",
        "react-router-dom": "^6.22.3"
      },
      devDependencies: {
        "@types/react": "^18.2.56",
        "@types/react-dom": "^18.2.19",
        "@typescript-eslint/eslint-plugin": "^7.0.2",
        "@typescript-eslint/parser": "^7.0.2",
        "@vitejs/plugin-react": "^4.2.1",
        "typescript": "^5.2.2",
        "vite": "^5.1.4"
      }
    }
  }
];

const AppSettingsNode = ({ data, id }: { data: any; id: string }) => {
  const { appSettings: currentSettings, updateAppSettings } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedStack, setSelectedStack] = useState(techStacks[0]);

  const updateSettings = (key: string, value: any) => {
    updateAppSettings({ ...currentSettings, [key]: value });
  };

  const handleTechStackChange = (stackId: string) => {
    const stack = techStacks.find(s => s.id === stackId);
    if (stack) {
      setSelectedStack(stack);
      updateSettings('techStack', stack);
    }
  };

  return (
    <div className={`min-w-[400px] px-6 py-4 shadow-lg rounded-lg ${currentSettings.darkMode ? 'bg-gray-800 border-amber-400' : 'bg-white border-amber-500'} border-2`}>
      <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
        <div className="flex items-center">
          <Settings className="h-6 w-6 text-amber-500 dark:text-amber-400 mr-2" />
          <div>
            <span className="text-lg font-bold text-amber-500 dark:text-amber-400">App Settings</span>
            <div className={`${currentSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Configure your application</div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded ${currentSettings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium ${currentSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Tech Stack</label>
            <select
              value={selectedStack.id}
              onChange={(e) => handleTechStackChange(e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                currentSettings.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-amber-400 focus:ring-amber-400' 
                  : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
              } shadow-sm`}
            >
              {techStacks.map(stack => (
                <option key={stack.id} value={stack.id}>{stack.name}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${currentSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>App Name</label>
              <input
                type="text"
                value={currentSettings.name}
                onChange={(e) => updateSettings('name', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  currentSettings.darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-amber-400 focus:ring-amber-400' 
                    : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
                } shadow-sm`}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${currentSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>App Title</label>
              <input
                type="text"
                value={currentSettings.title}
                onChange={(e) => updateSettings('title', e.target.value)}
                className={`mt-1 block w-full rounded-md ${
                  currentSettings.darkMode 
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-amber-400 focus:ring-amber-400' 
                    : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
                } shadow-sm`}
              />
            </div>
          </div>

          <div>
            <label className={`block text-sm font-medium ${currentSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Description</label>
            <textarea
              value={currentSettings.description}
              onChange={(e) => updateSettings('description', e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                currentSettings.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-amber-400 focus:ring-amber-400' 
                  : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
              } shadow-sm`}
              rows={2}
            />
          </div>

          <div>
            <label className={`block text-sm font-medium ${currentSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Icon Path</label>
            <input
              type="text"
              value={currentSettings.icon}
              onChange={(e) => updateSettings('icon', e.target.value)}
              className={`mt-1 block w-full rounded-md ${
                currentSettings.darkMode 
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-amber-400 focus:ring-amber-400' 
                  : 'border-gray-300 focus:border-amber-500 focus:ring-amber-500'
              } shadow-sm`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={`block text-sm font-medium ${currentSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Primary Color</label>
              <input
                type="color"
                value={currentSettings.theme.primary}
                onChange={(e) => updateSettings('theme', { ...currentSettings.theme, primary: e.target.value })}
                className="mt-1 block w-full h-10 rounded-md"
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${currentSettings.darkMode ? 'text-gray-300' : 'text-gray-700'}`}>Secondary Color</label>
              <input
                type="color"
                value={currentSettings.theme.secondary}
                onChange={(e) => updateSettings('theme', { ...currentSettings.theme, secondary: e.target.value })}
                className="mt-1 block w-full h-10 rounded-md"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppSettingsNode;