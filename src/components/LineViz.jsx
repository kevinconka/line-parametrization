"use client"

import React, { useState, useCallback, useRef, useMemo } from 'react';
import { Card } from '@/components/ui/card';
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
import ParameterSpace from './ParameterSpace';
import ImageSpace from './ImageSpace';

const LineViz = () => {
  const W = 640;
  const H = 640;
  
  const dragRef = useRef(null);
  const [paramType, setParamType] = useState("hough");
  const [params, setParams] = useState({ x: 0.5, y: 0.5 });

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

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="px-2 sm:px-4 h-14 flex items-center justify-between max-w-screen-2xl mx-auto">
          <h1 className="text-lg sm:text-xl font-semibold dark:text-white truncate">
            Line Parametrization Visualization
          </h1>
          <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          <div ref={dragRef}>
            <ParameterSpace 
              params={params}
              onMouseDown={handleMouseDown}
              paramSpace={currentParam.paramSpace}
            />
          </div>

          <ImageSpace 
            W={W}
            H={H}
            endpoints={endpoints}
            normalPoint={normalPoint}
            paramType={paramType}
            paramValues={paramValues}
          />

          <div className="md:col-span-2">
            <Card className="p-2 sm:p-4 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 dark:text-white">
                Mathematical Description
              </h2>
              <div className="overflow-y-auto">
                <MathDescription description={currentParam.description} />
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineViz;