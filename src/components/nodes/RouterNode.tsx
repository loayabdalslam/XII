import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Route, Wand2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode } from '../../services/ai';
import useStore from '../../store/useStore';

const RouterNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { appSettings, getRoutes, updateComponent } = useStore();
  const [isExpanded, setIsExpanded] = useState(true);

  const generateRouterCode = async () => {
    setIsGenerating(true);
    try {
      const routes = getRoutes();
      
      if (routes.length === 0) {
        alert('Please add and connect some controllers first');
        return;
      }

      const prompt = `
        Generate a React Router configuration with these routes:
        ${JSON.stringify(routes, null, 2)}
        
        Requirements:
        1. Use React Router v6
        2. Create a beautiful navigation layout with Tailwind CSS
        3. Include proper TypeScript types
        4. Add loading and error boundaries
        5. Support dark mode
        6. Use these theme colors: primary=${appSettings.theme.primary}, secondary=${appSettings.theme.secondary}
        
        Important:
        - Import components from proper relative paths
        - Include all necessary imports
        - Create a complete, production-ready router configuration
      `;

      const generatedCode = await generateCode(prompt);
      data.onCodeChange?.(generatedCode);
      updateComponent(id, { name: 'AppRouter' });
    } catch (error) {
      console.error('Error generating router code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={`min-w-[400px] px-6 py-4 shadow-lg rounded-lg ${appSettings.darkMode ? 'bg-gray-800 border-green-400' : 'bg-white border-green-500'} border-2`}>
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
        <div className="flex items-center">
          <Route className="h-6 w-6 text-green-500 dark:text-green-400 mr-2" />
          <div>
            <EditableLabel
              value={data.label}
              onChange={(newLabel) => updateComponent(id, { name: newLabel })}
              className="text-lg font-bold text-green-500 dark:text-green-400"
            />
            <div className={`${appSettings.darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Router Configuration</div>
          </div>
        </div>
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className={`p-1 rounded ${appSettings.darkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}
        >
          {isExpanded ? '−' : '+'}
        </button>
      </div>

      {isExpanded && (
        <div className="space-y-4">
          <div className={`${appSettings.darkMode ? 'bg-gray-700' : 'bg-gray-50'} p-3 rounded-lg`}>
            <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Available Routes</h4>
            {getRoutes().map((route, index) => (
              <div key={index} className={`text-sm font-mono ${appSettings.darkMode ? 'bg-gray-800 text-gray-300' : 'bg-white text-gray-700'} p-2 rounded mt-1`}>
                {route.path} → {route.component}
              </div>
            ))}
          </div>

          <div className="flex justify-end">
            <button
              onClick={generateRouterCode}
              disabled={isGenerating}
              className={`flex items-center px-3 py-1 rounded ${
                isGenerating
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                  : 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/50'
              }`}
            >
              <Wand2 className="w-4 h-4 mr-1" />
              {isGenerating ? 'Generating...' : 'Generate Router'}
            </button>
          </div>

          <div>
            <h4 className={`text-sm font-medium ${appSettings.darkMode ? 'text-gray-300' : 'text-gray-700'} mb-2`}>Generated Router</h4>
            <CodeEditor
              code={data.component.code}
              onChange={(code) => data.onCodeChange?.(code)}
              placeholder="Generated router code will appear here..."
            />
          </div>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default RouterNode;