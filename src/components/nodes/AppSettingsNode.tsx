import React, { useState } from 'react';
import { Handle, Position } from 'reactflow';
import { Settings } from 'lucide-react';
import EditableLabel from '../EditableLabel';
import useStore from '../../store/useStore';

interface AppSettings {
  name: string;
  title: string;
  description: string;
  icon: string;
  theme: {
    primary: string;
    secondary: string;
  };
}

const AppSettingsNode = ({ data, id }: { data: any; id: string }) => {
  const [settings, setSettings] = useState<AppSettings>({
    name: 'ai-mvc-app',
    title: 'AI MVC Application',
    description: 'A modern MVC application built with AI',
    icon: '/vite.svg',
    theme: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
    },
  });

  const updateSettings = (key: keyof AppSettings, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    useStore.getState().updateAppSettings({ ...settings, [key]: value });
  };

  return (
    <div className="min-w-[400px] px-6 py-4 shadow-lg rounded-lg bg-white border-2 border-amber-500">
      <div className="flex items-center mb-4 drag-handle cursor-move">
        <Settings className="h-6 w-6 text-amber-500 mr-2" />
        <div>
          <span className="text-lg font-bold text-amber-500">App Settings</span>
          <div className="text-gray-500">Configure your application</div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">App Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => updateSettings('name', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">App Title</label>
            <input
              type="text"
              value={settings.title}
              onChange={(e) => updateSettings('title', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            value={settings.description}
            onChange={(e) => updateSettings('description', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
            rows={2}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Icon Path</label>
          <input
            type="text"
            value={settings.icon}
            onChange={(e) => updateSettings('icon', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Primary Color</label>
            <input
              type="color"
              value={settings.theme.primary}
              onChange={(e) => updateSettings('theme', { ...settings.theme, primary: e.target.value })}
              className="mt-1 block w-full h-10 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Secondary Color</label>
            <input
              type="color"
              value={settings.theme.secondary}
              onChange={(e) => updateSettings('theme', { ...settings.theme, secondary: e.target.value })}
              className="mt-1 block w-full h-10 rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppSettingsNode;