import React, { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Command, Wand2 } from 'lucide-react';
import CodeEditor from '../CodeEditor';
import EditableLabel from '../EditableLabel';
import { NodeData } from '../../types';
import { generateCode } from '../../services/ai';
import useStore from '../../store/useStore';

const ControllerNode = ({ data, id }: { data: NodeData; id: string }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customLogic, setCustomLogic] = useState('');
  const { getConnectedNodes, updateComponent, getModelInterfaces } = useStore();
  const [modelInterfaces, setModelInterfaces] = useState<{ name: string; interface: string }[]>([]);

  useEffect(() => {
    const interfaces = getModelInterfaces(id);
    setModelInterfaces(interfaces);
    
    // Update the custom logic template with available interfaces
    if (interfaces.length > 0 && !customLogic) {
      const template = interfaces.map(int => `
// Available interface: ${int.interface}

// Example usage:
const [${int.name.toLowerCase()}s, set${int.name}s] = useState<${int.name}[]>([]);

// Add your custom logic here:
`).join('\n');
      
      setCustomLogic(template);
    }
  }, [id, getModelInterfaces]);

  const generateControllerCode = async () => {
    setIsGenerating(true);
    try {
      const connectedModels = getConnectedNodes(id, 'model');

      if (connectedModels.length === 0) {
        alert('Please connect this controller to at least one model first');
        return;
      }

      const modelPromises = connectedModels.map(async (modelNode) => {
        const modelCode = modelNode.data.component.code;
        const interfaceMatch = modelCode.match(/interface\s+(\w+)\s*{[^}]+}/);
        
        if (!interfaceMatch) {
          throw new Error(`No interface found in model: ${modelNode.data.component.name}`);
        }

        return {
          name: interfaceMatch[1],
          interface: interfaceMatch[0],
          code: modelCode,
        };
      });

      const models = await Promise.all(modelPromises);
      const primaryModel = models[0];
      const aiEnhancedName = `AI${primaryModel.name}Controller`;
      updateComponent(id, { name: aiEnhancedName });

      const prompt = `
        Given these model implementations:
        ${models.map(model => model.code).join('\n\n')}
        
        And this custom controller logic:
        ${customLogic}
        
        Generate a TypeScript React controller component that:
        1. Implements the custom logic provided
        2. Integrates with all connected models
        3. Creates a beautiful and responsive UI using Tailwind CSS
        4. Implements proper form handling and validation
        5. Includes loading and error states
        6. Uses proper TypeScript types
        7. Follows best practices and SOLID principles
        8. Is production-ready
        
        The component should include both the controller logic and the view.
        Return a single file that exports the complete component.
      `;

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
              onChange={(newLabel) => {
                const aiPrefix = newLabel.startsWith('AI') ? '' : 'AI';
                updateComponent(id, { name: `${aiPrefix}${newLabel}` });
              }}
              className="text-lg font-bold text-purple-500"
            />
            <div className="text-gray-500">Controller + View</div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {modelInterfaces.length > 0 && (
          <div className="bg-gray-50 p-3 rounded-lg">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Available Models</h4>
            {modelInterfaces.map((int, index) => (
              <div key={index} className="text-sm font-mono bg-white p-2 rounded mt-1">
                {int.interface}
              </div>
            ))}
          </div>
        )}

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Custom Logic & View Requirements</h4>
          <CodeEditor
            code={customLogic}
            onChange={setCustomLogic}
            placeholder="Define your custom logic and view requirements here..."
            height="h-48"
          />
        </div>

        <div className="flex justify-end">
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
            {isGenerating ? 'Generating...' : 'Generate Component'}
          </button>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Generated Component</h4>
          <CodeEditor
            code={data.component.code}
            onChange={(code) => data.onCodeChange?.(code)}
            placeholder="Generated component code will appear here..."
          />
        </div>
      </div>
      
      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
};

export default ControllerNode;