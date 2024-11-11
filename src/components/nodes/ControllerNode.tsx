import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Command, Wand2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode, generateControllerPrompt } from '../../services/ai';
import useStore from '../../store/useStore';

const ControllerNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { getConnectedNode, updateComponent } = useStore();

  const generateControllerCode = async () => {
    setIsGenerating(true);
    try {
      const modelNode = getConnectedNode(id, 'model');

      if (!modelNode) {
        alert('Please connect this controller to a model first');
        return;
      }

      const modelCode = modelNode.data.component.code;
      const interfaceMatch = modelCode.match(/interface\s+(\w+)\s*{[^}]+}/);
      
      if (!interfaceMatch) {
        alert('No interface found in the model code');
        return;
      }

      const interfaceName = interfaceMatch[1];
      updateComponent(id, { name: `${interfaceName}Controller` });

      const prompt = generateControllerPrompt(modelCode, interfaceMatch[0]);
      const generatedCode = await generateCode(prompt);
      data.onCodeChange?.(generatedCode);
    } catch (error) {
      console.error('Error generating controller code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-w-[400px] px-6 py-4 shadow-lg rounded-lg bg-white border-2 border-purple-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
        <div className="flex items-center">
          <Command className="h-6 w-6 text-purple-500 mr-2" />
          <div>
            <EditableLabel
              value={data.label}
              onChange={(newLabel) => updateComponent(id, { name: newLabel })}
              className="text-lg font-bold text-purple-500"
            />
            <div className="text-gray-500">Controller</div>
          </div>
        </div>
        <button
          onClick={generateControllerCode}
          disabled={isGenerating}
          className={`flex items-center px-3 py-1 rounded ${
            isGenerating
              ? 'bg-gray-100 text-gray-400'
              : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
          }`}
        >
          <Wand2 className="w-4 h-4 mr-1" />
          {isGenerating ? 'Generating...' : 'Generate Controller'}
        </button>
      </div>
      
      <CodeEditor
        code={data.component.code}
        onChange={(code) => data.onCodeChange?.(code)}
        title="Controller Logic"
        placeholder="Connect to a model and click Generate to create controller code..."
      />
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default ControllerNode;