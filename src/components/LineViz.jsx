import React, { useState, useCallback, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ChevronRight, ChevronDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const LineViz = () => {
  const W = 640;
  const H = 640;
  const maxRho = Math.sqrt((W/2)**2 + (H/2)**2);
  
  const dragRef = useRef(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [paramType, setParamType] = useState("hough");
  
  const [params, setParams] = useState({
    x: 0.5,  // normalized x coordinate [0,1]
    y: 0.5   // normalized y coordinate [0,1]
  });

  const getHoughLineEndpoints = useCallback((thetaNorm, rhoNorm) => {
    const theta = thetaNorm * Math.PI;
    const rho = (rhoNorm * 2 - 1) * maxRho;
    
    const pts = [];
    const left = -W/2;
    const right = W/2;
    const top = -H/2;
    const bottom = H/2;
    
    if (Math.abs(Math.sin(theta)) > 1e-6) {
      const yLeft = (rho - left * Math.cos(theta)) / Math.sin(theta);
      if (top <= yLeft && yLeft <= bottom) pts.push([left, yLeft]);
      
      const yRight = (rho - right * Math.cos(theta)) / Math.sin(theta);
      if (top <= yRight && yRight <= bottom) pts.push([right, yRight]);
    }
    
    if (Math.abs(Math.cos(theta)) > 1e-6) {
      const xTop = (rho - top * Math.sin(theta)) / Math.cos(theta);
      if (left <= xTop && xTop <= right) pts.push([xTop, top]);
      
      const xBottom = (rho - bottom * Math.sin(theta)) / Math.cos(theta);
      if (left <= xBottom && xBottom <= right) pts.push([xBottom, bottom]);
    }
    
    const uniquePts = pts.filter((p1, idx) => 
      !pts.some((p2, idx2) => idx2 > idx && 
        Math.abs(p1[0] - p2[0]) < 1e-6 && 
        Math.abs(p1[1] - p2[1]) < 1e-6
      )
    );
    
    if (uniquePts.length >= 2) {
      return [
        { x: uniquePts[0][0] + W/2, y: uniquePts[0][1] + H/2 },
        { x: uniquePts[1][0] + W/2, y: uniquePts[1][1] + H/2 }
      ];
    }
    return null;
  }, [W, H, maxRho]);

  const getMidpointThetaLineEndpoints = useCallback((midpoint, theta) => {
    // Normalize midpoint from [0.15, 0.85] to [0,1]
    const normalizedMidpoint = (midpoint - 0.15) / 0.7;
    
    // Convert theta from [0,1] to [-pi/2, pi/2]
    const thetaRad = theta * Math.PI - 0.5 * Math.PI;
    
    // Calculate slope and intercept
    const m = Math.tan(thetaRad);
    const b = normalizedMidpoint - m * 0.5;  // y-intercept
    
    // Calculate endpoints
    let x1, y1, x2, y2;
    
    if (Math.abs(m) > 1000) { // Near-vertical line
      x1 = b * W;
      y1 = 0;
      x2 = b * W;
      y2 = H;
    } else {
      x1 = 0;
      y1 = b * H;
      x2 = W;
      y2 = m * W + b * H;
    }
    
    return [
      { x: x1, y: y1 },
      { x: x2, y: y2 }
    ];
  }, [W, H]);

  const getEndpoints = useCallback(() => {
    if (paramType === "hough") {
      return getHoughLineEndpoints(params.x, params.y);
    } else {
      return getMidpointThetaLineEndpoints(params.y, params.x);
    }
  }, [paramType, params, getHoughLineEndpoints, getMidpointThetaLineEndpoints]);

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

  const endpoints = getEndpoints();
  
  const getParamValues = () => {
    if (paramType === "hough") {
      const theta = params.x * Math.PI;
      const rho = (params.y * 2 - 1) * maxRho;
      return {
        param1: { label: "θ", value: `${theta.toFixed(2)} rad` },
        param2: { label: "ρ", value: `${rho.toFixed(2)} px` }
      };
    } else {
      const theta = params.x * Math.PI - 0.5 * Math.PI;
      const midpoint = 0.15 + params.y * 0.7;
      const midpointPixel = midpoint * H;
      return {
        param1: { label: "θ", value: `${theta.toFixed(2)} rad` },
        param2: { label: "midpoint", value: midpointPixel.toFixed(2) }
      };
    }
  };

  const paramValues = getParamValues();
  const normalPoint = paramType === "hough" ? {
    x: (params.y * 2 - 1) * maxRho * Math.cos(params.x * Math.PI) + W/2,
    y: (params.y * 2 - 1) * maxRho * Math.sin(params.x * Math.PI) + H/2
  } : null;

  return (
    <div className="flex flex-col gap-6 p-4 min-h-screen min-w-full">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-4">
              <span>Line Parametrization Visualization</span>
              <Select value={paramType} onValueChange={setParamType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select parametrization" />
                </SelectTrigger>
                <SelectContent>
                  {/* <SelectItem value="hough">Hough Transform</SelectItem>
                  <SelectItem value="midpoint-theta">Midpoint-Theta</SelectItem> */}
                  <SelectItem value="hough">Method 1</SelectItem>
                  <SelectItem value="midpoint-theta">Method 2</SelectItem>
                </SelectContent>
              </Select>
            </CardTitle>
            {/* <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-normal text-gray-600 hover:text-gray-900 bg-gray-50 p-2 rounded-md"
            >
              {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              {isExpanded ? "Hide" : "Show"} Mathematical Description
            </button> */}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {isExpanded && (
            <div className="prose max-w-none bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mt-0">
                {paramType === "hough" ? "Hough Transform" : "Midpoint-Theta"} Parametrization
              </h3>
              
              {paramType === "hough" ? (
                <>
                  <p>
                    The Hough transform parametrizes lines using normal vector parameters (θ,ρ):
                  </p>
                  <div className="bg-white p-4 rounded border my-4">
                    <ul className="mt-2">
                      <li>θ ∈ [0, π]: angle of the normal vector</li>
                      <li>ρ ∈ [-ρ_max, ρ_max]: distance from origin to line</li>
                      <li>ρ = x·cos(θ) + y·sin(θ)</li>
                    </ul>
                  </div>
                </>
              ) : (
                <>
                  <p>
                    The midpoint-theta parametrization uses:
                  </p>
                  <div className="bg-white p-4 rounded border my-4">
                    <ul className="mt-2">
                      <li>midpoint ∈ [0.15, 0.85]: relative vertical position</li>
                      <li>θ ∈ [-π/2, π/2]: angle from vertical</li>
                      <li>Converts to y = mx + b form where:
                        <ul>
                          <li>m = tan(θ)</li>
                          <li>b = midpoint - m·0.5</li>
                        </ul>
                      </li>
                    </ul>
                  </div>
                </>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            {/* Parameter Space */}
            <div 
              ref={dragRef}
              className="relative flex-1 aspect-square border border-gray-300 cursor-crosshair bg-white"
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
                      stroke="#eee"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1={`${i * 10}%`}
                      x2="100%"
                      y2={`${i * 10}%`}
                      stroke="#eee"
                      strokeWidth="1"
                    />
                  </React.Fragment>
                ))}
                <circle
                  cx={`${params.x * 100}%`}
                  cy={`${params.y * 100}%`}
                  r="6"
                  fill="blue"
                />
              </svg>
            </div>

            {/* Image Space */}
            <div className="relative flex-1 aspect-square border-gray-300 bg-white">
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
                      stroke="#eee"
                      strokeWidth="1"
                    />
                    <line
                      x1="0"
                      y1={i * (H/10)}
                      x2={W}
                      y2={i * (H/10)}
                      stroke="#eee"
                      strokeWidth="1"
                    />
                  </React.Fragment>
                ))}
                
                <line x1={W/2} y1="0" x2={W/2} y2={H} stroke="#ccc" strokeWidth="1" />
                <line x1="0" y1={H/2} x2={W} y2={H/2} stroke="#ccc" strokeWidth="1" />
                
                {endpoints && (
                  <>
                    <line
                      x1={endpoints[0].x}
                      y1={endpoints[0].y}
                      x2={endpoints[1].x}
                      y2={endpoints[1].y}
                      stroke="red"
                      strokeWidth="2"
                    />
                    
                    {paramType === "hough" && normalPoint && (
                      <line
                        x1={W/2}
                        y1={H/2}
                        x2={normalPoint.x}
                        y2={normalPoint.y}
                        stroke="blue"
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
                  fill="black"
                />
                
                {/* <text
                  x={10}
                  y={30}
                  fill="black"
                  fontSize="24"
                  fontFamily="monospace"
                >
                  <tspan x="10" dy="0">{paramValues.param1.label} = {paramValues.param1.value}</tspan>
                  <tspan x="10" dy="30">{paramValues.param2.label} = {paramValues.param2.value}</tspan>
                </text> */}
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LineViz;