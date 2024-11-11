import React from 'react';
import { FileCode, Download } from 'lucide-react';
import useStore from '../store/useStore';

const Toolbar = () => {
  const { generateFiles, generatedFiles } = useStore();

  const downloadFiles = () => {
    const zip = new JSZip();
    
    // Add package.json
    zip.file('package.json', JSON.stringify({
      name: "todo-app",
      private: true,
      version: "0.0.0",
      type: "module",
      scripts: {
        "dev": "vite",
        "build": "tsc && vite build",
        "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
        "preview": "vite preview"
      },
      dependencies: {
        "react": "^18.2.0",
        "react-dom": "^18.2.0"
      },
      devDependencies: {
        "@types/react": "^18.2.15",
        "@types/react-dom": "^18.2.7",
        "@typescript-eslint/eslint-plugin": "^6.0.0",
        "@typescript-eslint/parser": "^6.0.0",
        "@vitejs/plugin-react": "^4.0.3",
        "autoprefixer": "^10.4.14",
        "eslint": "^8.45.0",
        "eslint-plugin-react-hooks": "^4.6.0",
        "eslint-plugin-react-refresh": "^0.4.3",
        "postcss": "^8.4.27",
        "tailwindcss": "^3.3.3",
        "typescript": "^5.0.2",
        "vite": "^4.4.5"
      }
    }, null, 2));

    // Add configuration files
    zip.file('tsconfig.json', JSON.stringify({
      compilerOptions: {
        target: "ES2020",
        useDefineForClassFields: true,
        lib: ["ES2020", "DOM", "DOM.Iterable"],
        module: "ESNext",
        skipLibCheck: true,
        moduleResolution: "bundler",
        allowImportingTsExtensions: true,
        resolveJsonModule: true,
        isolatedModules: true,
        noEmit: true,
        jsx: "react-jsx",
        strict: true,
        noUnusedLocals: true,
        noUnusedParameters: true,
        noFallthroughCasesInSwitch: true
      },
      include: ["src"],
      references: [{ path: "./tsconfig.node.json" }]
    }, null, 2));

    // Add generated component files
    Object.entries(generatedFiles).forEach(([path, code]) => {
      zip.file(`src/${path}`, code);
    });

    // Generate and download the zip file
    zip.generateAsync({ type: "blob" }).then((content) => {
      const url = window.URL.createObjectURL(content);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'todo-app.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
      <div className="flex gap-2">
        <button
          onClick={generateFiles}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
        >
          <FileCode className="w-5 h-5 mr-2" />
          Generate Code
        </button>
        {Object.keys(generatedFiles).length > 0 && (
          <button
            onClick={downloadFiles}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-5 h-5 mr-2" />
            Download Project
          </button>
        )}
      </div>
      
      {Object.keys(generatedFiles).length > 0 && (
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Generated Files:</h3>
          <div className="max-h-96 overflow-y-auto space-y-2">
            {Object.entries(generatedFiles).map(([path, code]) => (
              <div key={path} className="p-3 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-700 mb-2">{path}</h4>
                <pre className="text-sm overflow-x-auto p-2 bg-white rounded border">
                  {code.slice(0, 100)}...
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Toolbar;