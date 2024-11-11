import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Database, Wand2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode, generateModelPrompt } from '../../services/ai';
import useStore from '../../store/useStore';

const ModelNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [interfaceCode, setInterfaceCode] = useState('');
  const updateComponent = useStore((state) => state.updateComponent);

  const generateAICode = async () => {
    if (!interfaceCode.trim()) {
      alert('Please define the interface first');
      return;
    }

    setIsGenerating(true);
    try {
      const prompt = generateModelPrompt(interfaceCode);
      const generatedCode = await generateCode(prompt);
      data.onCodeChange?.(`${interfaceCode}\n\n${generatedCode}`);
      
      // Extract interface name and update component name
      const interfaceMatch = interfaceCode.match(/interface\s+(\w+)/);
      if (interfaceMatch) {
        const interfaceName = interfaceMatch[1];
        updateComponent(id, { name: `${interfaceName}Model` });
      }
    } catch (error) {
      console.error('Error generating model code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-w-[400px] px-6 py-4 shadow-lg rounded-lg bg-white border-2 border-blue-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
        <div className="flex items-center">
          <Database className="h-6 w-6 text-blue-500 mr-2" />
          <div>
            <EditableLabel
              value={data.label}
              onChange={(newLabel) => updateComponent(id, { name: newLabel })}
              className="text-lg font-bold text-blue-500"
            />
            <div className="text-gray-500">Model</div>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Interface Definition</h4>
          <CodeEditor
            code={interfaceCode}
            onChange={setInterfaceCode}
            placeholder="Define your interface here..."
            height="h-32"
          />
        </div>

        <div className="flex justify-end">
          <button
            onClick={generateAICode}
            disabled={isGenerating}
            className={`flex items-center px-3 py-1 rounded ${
              isGenerating
                ? 'bg-gray-100 text-gray-400'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            <Wand2 className="w-4 h-4 mr-1" />
            {isGenerating ? 'Generating...' : 'Generate Model'}
          </button>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Model</h4>
          <CodeEditor
            code={data.component.code}
            onChange={(code) => data.onCodeChange?.(code)}
            placeholder="Generated model code will appear here..."
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default ModelNode;