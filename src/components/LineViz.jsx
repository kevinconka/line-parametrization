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
    const parameterSpace = document.getElementById('parameter-space');
    if (!parameterSpace) return;
    
    const rect = parameterSpace.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (clientY - rect.top) / rect.height));
    
    setParams({ x, y });
  }, []);

  const handleStart = useCallback((e) => {
    e.preventDefault();
    
    // Handle both mouse and touch events
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    updateParams(clientX, clientY);
  }, [updateParams]);

  const handleMove = useCallback((e) => {
    e.preventDefault();
    
    // Handle both mouse and touch events
    const clientX = e.type.includes('mouse') ? e.clientX : e.touches[0].clientX;
    const clientY = e.type.includes('mouse') ? e.clientY : e.touches[0].clientY;
    
    updateParams(clientX, clientY);
  }, [updateParams]);

  const handleEnd = useCallback(() => {
    window.removeEventListener('mousemove', handleMove);
    window.removeEventListener('mouseup', handleEnd);
    window.removeEventListener('touchmove', handleMove);
    window.removeEventListener('touchend', handleEnd);
  }, [handleMove]);

  const handleMouseDown = useCallback((e) => {
    handleStart(e);
    
    window.addEventListener('mousemove', handleMove);
    window.addEventListener('mouseup', handleEnd);
  }, [handleStart, handleMove, handleEnd]);

  const handleTouchStart = useCallback((e) => {
    handleStart(e);
    
    window.addEventListener('touchmove', handleMove, { passive: false });
    window.addEventListener('touchend', handleEnd);
  }, [handleStart, handleMove, handleEnd]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation Bar */}
      <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 z-10">
        <div className="px-3 min-h-[3.5rem] flex items-center justify-between max-w-screen-2xl mx-auto">
          <h1 className="text-base sm:text-lg font-semibold dark:text-white">
            Line Parametrization
          </h1>
          <div className="flex items-center gap-2">
            <Select value={paramType} onValueChange={setParamType}>
              <SelectTrigger className="w-[120px] sm:w-[180px] h-9">
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
      <div className="px-3 py-2 sm:p-4 max-w-screen-2xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 sm:gap-4">
          <div ref={dragRef} className="w-full max-w-lg mx-auto md:max-w-none">
            <ParameterSpace 
              params={params}
              onMouseDown={handleMouseDown}
              onTouchStart={handleTouchStart}
            />
          </div>

          <div className="w-full max-w-lg mx-auto md:max-w-none">
            <ImageSpace 
              W={W}
              H={H}
              endpoints={endpoints}
              normalPoint={normalPoint}
              paramType={paramType}
              paramValues={paramValues}
            />
          </div>

          <div className="md:col-span-2">
            <Card className="p-2 sm:p-4 dark:border-gray-700">
              <h2 className="text-base sm:text-lg font-medium mb-2 sm:mb-4 dark:text-white">
                Mathematical Description
              </h2>
              <div className="overflow-y-auto flex justify-center">
                <div className="max-w-4xl w-full">
                  <MathDescription description={currentParam.description} />
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LineViz;