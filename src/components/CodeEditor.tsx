import React, { useState } from 'react';
import { Maximize2, Minimize2, X } from 'lucide-react';
import useStore from '../store/useStore';

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  title?: string;
  placeholder?: string;
  height?: string;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ 
  code, 
  onChange, 
  title,
  placeholder = "Enter your code here...",
  height = "h-64"
}) => {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const { appSettings } = useStore();

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-gray-900 p-8' : 'w-full'}`}>
      <div className="flex justify-between items-center mb-2">
        {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
        <div className="flex gap-2">
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1 hover:bg-gray-700 rounded text-gray-300"
          >
            {isFullscreen ? (
              <Minimize2 className="w-5 h-5" />
            ) : (
              <Maximize2 className="w-5 h-5" />
            )}
          </button>
          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1 hover:bg-gray-700 rounded text-gray-300"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>
      <textarea
        value={code}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full font-mono text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 
          bg-gray-900 border-gray-700 text-gray-300 placeholder-gray-500 p-4 ${
          isFullscreen ? 'h-[calc(100vh-120px)]' : height
        }`}
        spellCheck="false"
      />
    </div>
  );
}

export default CodeEditor;