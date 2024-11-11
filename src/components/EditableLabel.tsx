import React, { useState, useRef, useEffect } from 'react';
import { Check, X } from 'lucide-react';
import useStore from '../store/useStore';

interface EditableLabelProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const EditableLabel: React.FC<EditableLabelProps> = ({ value, onChange, className = '' }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const { appSettings } = useStore();

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleSubmit = () => {
    if (editValue.trim()) {
      onChange(editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(value);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-1">
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
            if (e.key === 'Escape') handleCancel();
          }}
          className="px-1 py-0.5 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500
            dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300"
        />
        <button
          onClick={handleSubmit}
          className="p-0.5 hover:bg-green-100 dark:hover:bg-green-900/30 rounded text-green-600 dark:text-green-400"
        >
          <Check className="w-4 h-4" />
        </button>
        <button
          onClick={handleCancel}
          className="p-0.5 hover:bg-red-100 dark:hover:bg-red-900/30 rounded text-red-600 dark:text-red-400"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 px-1 rounded ${className}`}
    >
      {value}
    </span>
  );
};

export default EditableLabel;