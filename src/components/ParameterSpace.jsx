import React from 'react';
import { Card } from '@/components/ui/card';

const ParameterSpace = ({ params, onMouseDown, onTouchStart }) => {
  return (
    <Card className="p-2 sm:p-4 dark:border-gray-700">
      <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 dark:text-white">Parameter Space</h2>
      <div className="aspect-square">
        <div 
          id="parameter-space"
          className="relative w-full h-full border border-gray-300 dark:border-gray-600 cursor-crosshair bg-white dark:bg-gray-800 rounded-lg touch-none"
          onMouseDown={onMouseDown}
          onTouchStart={onTouchStart}
        >
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {/* Grid Lines */}
            {Array.from({ length: 11 }).map((_, i) => (
              <React.Fragment key={i}>
                <line
                  x1={`${i * 10}%`}
                  y1="0"
                  x2={`${i * 10}%`}
                  y2="100%"
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1={`${i * 10}%`}
                  x2="100%"
                  y2={`${i * 10}%`}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="1"
                />
              </React.Fragment>
            ))}

            {/* Parameter Point */}
            <circle
              cx={`${params.x * 100}%`}
              cy={`${params.y * 100}%`}
              r="6"
              className="fill-blue-500 dark:fill-blue-400"
            />
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default ParameterSpace; 