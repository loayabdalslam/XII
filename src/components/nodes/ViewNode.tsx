import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Layout, Wand2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode, generateViewPrompt } from '../../services/ai';
import useStore from '../../store/useStore';

const ViewNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { getConnectedNode, updateComponent } = useStore();

  const generateViewCode = async () => {
    setIsGenerating(true);
    try {
      const controllerNode = getConnectedNode(id, 'controller');

      if (!controllerNode) {
        alert('Please connect this view to a controller first');
        return;
      }

      const modelNode = getConnectedNode(controllerNode.id, 'model');

      if (!modelNode) {
        alert('The controller must be connected to a model');
        return;
      }

      const interfaceMatch = modelNode.data.component.code.match(/interface\s+(\w+)\s*{[^}]+}/);
      
      if (!interfaceMatch) {
        alert('No interface found in the model code');
        return;
      }

      const interfaceName = interfaceMatch[1];
      updateComponent(id, { name: `${interfaceName}View` });

      const prompt = generateViewPrompt(controllerNode.data.component.code, interfaceMatch[0]);
      const generatedCode = await generateCode(prompt);
      data.onCodeChange?.(generatedCode);
    } catch (error) {
      console.error('Error generating view code:', error);
      alert('Failed to generate code. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-w-[400px] px-6 py-4 shadow-lg rounded-lg bg-white border-2 border-green-500">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      <div className="flex items-center justify-between mb-4 drag-handle cursor-move">
        <div className="flex items-center">
          <Layout className="h-6 w-6 text-green-500 mr-2" />
          <div>
            <EditableLabel
              value={data.label}
              onChange={(newLabel) => updateComponent(id, { name: newLabel })}
              className="text-lg font-bold text-green-500"
            />
            <div className="text-gray-500">View</div>
          </div>
        </div>
        <button
          onClick={generateViewCode}
          disabled={isGenerating}
          className={`flex items-center px-3 py-1 rounded ${
            isGenerating
              ? 'bg-gray-100 text-gray-400'
              : 'bg-green-50 text-green-600 hover:bg-green-100'
          }`}
        >
          <Wand2 className="w-4 h-4 mr-1" />
          {isGenerating ? 'Generating...' : 'Generate View'}
        </button>
      </div>
      
      <CodeEditor
        code={data.component.code}
        onChange={(code) => data.onCodeChange?.(code)}
        title="View Component"
        placeholder="Connect to a controller and click Generate to create view code..."
      />
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default ViewNode;