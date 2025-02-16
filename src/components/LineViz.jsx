"use client"

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { parametrizations, getParametrizationsList } from '@/lib/lineParametrizations';
import MathDescription from './MathDescription';
import { ThemeToggle } from './ThemeToggle';

const LineViz = () => {
  const W = 640;
  const H = 640;
  
  const dragRef = useRef(null);
  const [paramType, setParamType] = useState("hough");
  
  const [params, setParams] = useState({
    x: 0.5,  // normalized x coordinate [0,1]
    y: 0.5   // normalized y coordinate [0,1]
  });

  const currentParam = useMemo(() => parametrizations[paramType], [paramType]);
  
  const { endpoints, paramValues, normalPoint } = useMemo(() => ({
    endpoints: currentParam.getEndpoints(params, W, H),
    paramValues: currentParam.getParamValues(params, W, H),
    normalPoint: currentParam.getNormalPoint(params, W, H)
  }), [currentParam, params, W, H]);

  const updateParams = useCallback((clientX, clientY) => {
    const rect = dragRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    
    setParams({ x, y });
  }, []);

  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    updateParams(e.clientX, e.clientY);
    
    const handleMouseMove = (e) => {
      e.preventDefault();
      updateParams(e.clientX, e.clientY);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  }, [updateParams]);

  const AxisLabels = ({ xLabel, yLabel }) => (
    <>
      {/* X-axis label */}
      <text 
        x="50%" 
        y="100%" 
        dy="-10"
        textAnchor="middle"
        className="fill-gray-700 dark:fill-gray-300 text-sm"
      >
        {xLabel}
      </text>

      {/* Y-axis label */}
      <g transform="translate(25, 50%)">
        <text 
          textAnchor="middle"
          className="fill-gray-700 dark:fill-gray-300 text-sm"
          transform="rotate(-90)"
        >
          {yLabel}
        </text>
      </g>

      {/* Tick marks and values */}
      {[0, 0.25, 0.5, 0.75, 1].map((tick) => (
        <React.Fragment key={tick}>
          {/* X-axis ticks */}
          <text
            x={`${tick * 100}%`}
            y="100%"
            dy="-25"
            textAnchor="middle"
            className="fill-gray-500 dark:fill-gray-400 text-xs"
          >
            {(tick * (currentParam.paramSpace.xRange[1] - currentParam.paramSpace.xRange[0]) + 
              currentParam.paramSpace.xRange[0]).toFixed(1)}
          </text>

          {/* Y-axis ticks */}
          <text
            x="0"
            dx="25"
            y={`${(1 - tick) * 100}%`}
            textAnchor="end"
            alignmentBaseline="middle"
            className="fill-gray-500 dark:fill-gray-400 text-xs"
          >
            {(tick * (currentParam.paramSpace.yRange[1] - currentParam.paramSpace.yRange[0]) + 
              currentParam.paramSpace.yRange[0]).toFixed(2)}
          </text>
        </React.Fragment>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="px-2 sm:px-4 h-14 flex items-center justify-between max-w-screen-2xl mx-auto">
          <h1 className="text-lg sm:text-xl font-semibold dark:text-white">
            Line Parametrization Visualization
          </h1>
          <div className="flex items-center gap-2 sm:gap-4">
            <Select value={paramType} onValueChange={setParamType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select parametrization" />
              </SelectTrigger>
              <SelectContent>
                {getParametrizationsList().map(p => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ThemeToggle />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-2 sm:p-4 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4">
          {/* Left Column - Parameter Space */}
          <Card className="p-2 sm:p-4 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 dark:text-white">Parameter Space</h2>
            <div className="aspect-square">
              <div 
                ref={dragRef}
                className="relative w-full h-full border border-gray-300 dark:border-gray-600 cursor-crosshair bg-white dark:bg-gray-800 rounded-lg"
                onMouseDown={handleMouseDown}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
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

          {/* Middle Column - Image Space */}
          <Card className="p-2 sm:p-4 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 dark:text-white">Image Space</h2>
            <div className="aspect-square">
              <div className="relative w-full h-full border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-lg">
                <svg 
                  viewBox={`0 0 ${W} ${H}`}
                  className="w-full h-full"
                >
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
                  
                  <circle
                    cx={W/2}
                    cy={H/2}
                    r="4"
                    className="fill-gray-900 dark:fill-gray-100"
                  />
                  
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

          {/* Right Column - Mathematical Description */}
          <Card className="p-2 sm:p-4 dark:border-gray-700">
            <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 dark:text-white">Mathematical Description</h2>
            <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
              <MathDescription description={currentParam.description} />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LineViz;