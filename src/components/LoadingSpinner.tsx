import React, { useEffect, useState } from 'react';
import useStore from '../store/useStore';

interface LoadingSpinnerProps {
  duration?: number;
  onComplete?: () => void;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ 
  duration = 5000,
  onComplete 
}) => {
  const [progress, setProgress] = useState(0);
  const { appSettings } = useStore();
  const isDarkMode = appSettings.darkMode;

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        onComplete?.();
      }
    }, 50);

    return () => clearInterval(interval);
  }, [duration, onComplete]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-white dark:bg-gray-900 transition-colors duration-300">
      <div className="w-32 h-32 mb-8 relative">
        <img
          src={isDarkMode ? "/media/logo-white.png" : "/media/logo-white.png"}
          alt="Logo"
          className="w-full h-full object-contain"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke={isDarkMode ? "#1f2937" : "#f3f4f6"}
              strokeWidth="8"
            />
            <circle
              cx="64"
              cy="64"
              r="60"
              fill="none"
              stroke={isDarkMode ? "#60a5fa" : "#3b82f6"}
              strokeWidth="8"
              strokeDasharray={`${2 * Math.PI * 60}`}
              strokeDashoffset={`${2 * Math.PI * 60 * (1 - progress / 100)}`}
              className="transition-all duration-300 ease-out"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
      <div className={`text-2xl font-semibold ${
        isDarkMode ? 'text-white' : 'text-gray-900'
      }`}>
        Loading...
      </div>
      <div className={`mt-2 text-sm ${
        isDarkMode ? 'text-gray-400' : 'text-gray-500'
      }`}>
        {Math.round(progress)}%
      </div>
    </div>
  );
};

export default LoadingSpinner;