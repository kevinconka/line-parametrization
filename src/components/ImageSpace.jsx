import React from 'react';
import { Card } from '@/components/ui/card';

const ImageSpace = ({ W, H, endpoints, normalPoint, paramType, paramValues }) => {
  return (
    <Card className="p-2 sm:p-4 dark:border-gray-700">
      <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 dark:text-white">Image Space</h2>
      <div className="aspect-square">
        <div className="relative w-full h-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg">
          <svg 
            viewBox={`0 0 ${W} ${H}`}
            className="w-full h-full"
          >
            {/* Grid Lines */}
            {Array.from({ length: 11 }).map((_, i) => (
              <React.Fragment key={i}>
                <line
                  x1={i * (W/10)}
                  y1="0"
                  x2={i * (W/10)}
                  y2={H}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="1"
                />
                <line
                  x1="0"
                  y1={i * (H/10)}
                  x2={W}
                  y2={i * (H/10)}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-700"
                  strokeWidth="1"
                />
              </React.Fragment>
            ))}
            
            {/* Center Lines */}
            <line 
              x1={W/2} y1="0" x2={W/2} y2={H} 
              stroke="currentColor" 
              className="text-gray-300 dark:text-gray-600" 
              strokeWidth="1" 
            />
            <line 
              x1="0" y1={H/2} x2={W} y2={H/2} 
              stroke="currentColor" 
              className="text-gray-300 dark:text-gray-600" 
              strokeWidth="1" 
            />
            
            {/* Line and Normal Vector */}
            {endpoints && (
              <>
                <line
                  x1={endpoints[0].x}
                  y1={endpoints[0].y}
                  x2={endpoints[1].x}
                  y2={endpoints[1].y}
                  className="stroke-red-500 dark:stroke-red-400"
                  strokeWidth="2"
                />
                
                {paramType === "hough" && normalPoint && (
                  <line
                    x1={W/2}
                    y1={H/2}
                    x2={normalPoint.x}
                    y2={normalPoint.y}
                    className="stroke-blue-500 dark:stroke-blue-400"
                    strokeWidth="2"
                    strokeDasharray="4"
                  />
                )}
              </>
            )}
            
            {/* Origin Point */}
            <circle
              cx={W/2}
              cy={H/2}
              r="4"
              className="fill-gray-900 dark:fill-gray-100"
            />
            
            {/* Parameter Values */}
            <text
              x={10}
              y={30}
              className="fill-gray-900 dark:fill-gray-100 font-mono text-2xl"
            >
              <tspan x="10" dy="0">{paramValues.param1.label} = {paramValues.param1.value}</tspan>
              <tspan x="10" dy="30">{paramValues.param2.label} = {paramValues.param2.value}</tspan>
            </text>
          </svg>
        </div>
      </div>
    </Card>
  );
};

export default ImageSpace; 