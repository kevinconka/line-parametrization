const getMaxRho = (width, height) => Math.sqrt((width/2)**2 + (height/2)**2);

export const parametrizations = {
  hough: {
    id: "hough",
    name: "Hough Transform",
    description: {
      overview: "The Hough transform parametrizes lines using normal vector parameters (θ,ρ), representing the angle and distance of the perpendicular line from the origin to the target line.",
      parameters: [
        "θ: angle of the normal vector from the x-axis (range: 0 to π)",
        "ρ: signed distance from origin to line (range: -ρ_max to ρ_max)"
      ],
      equations: [
        "x' = x - W/2",
        "y' = y - H/2",
        "ρ = x'·cos(θ) + y'·sin(θ)",
        "ρ_max = sqrt((W/2)^2 + (H/2)^2)"
      ],
      notes: [
        "The parameter space is normalized to [0,1] for both θ and ρ",
      ]
    },
    paramSpace: {
      xLabel: "θ",
      yLabel: "ρ",
      xRange: [0, 1],
      yRange: [0, 1]
    },
    getEndpoints: (params, width, height) => {
      const maxRho = getMaxRho(width, height);
      const thetaRad = params.x * Math.PI;
      const rho = (params.y * 2 - 1) * maxRho;
      
      const pts = [];
      const left = -width/2;
      const right = width/2;
      const top = -height/2;
      const bottom = height/2;
      
      if (Math.abs(Math.sin(thetaRad)) > 1e-6) {
        const yLeft = (rho - left * Math.cos(thetaRad)) / Math.sin(thetaRad);
        if (top <= yLeft && yLeft <= bottom) pts.push([left, yLeft]);
        
        const yRight = (rho - right * Math.cos(thetaRad)) / Math.sin(thetaRad);
        if (top <= yRight && yRight <= bottom) pts.push([right, yRight]);
      }
      
      if (Math.abs(Math.cos(thetaRad)) > 1e-6) {
        const xTop = (rho - top * Math.sin(thetaRad)) / Math.cos(thetaRad);
        if (left <= xTop && xTop <= right) pts.push([xTop, top]);
        
        const xBottom = (rho - bottom * Math.sin(thetaRad)) / Math.cos(thetaRad);
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
          { x: uniquePts[0][0] + width/2, y: uniquePts[0][1] + height/2 },
          { x: uniquePts[1][0] + width/2, y: uniquePts[1][1] + height/2 }
        ];
      }
      return null;
    },
    getParamValues: (params, width, height) => {
      const maxRho = getMaxRho(width, height);
      const thetaDeg = params.x * 180;
      const rho = (params.y * 2 - 1) * maxRho;
      return {
        param1: { label: "θ", value: `${thetaDeg.toFixed(2)}°` },
        param2: { label: "ρ", value: `${rho.toFixed(2)} px` }
      };
    },
    getNormalPoint: (params, width, height) => {
      const maxRho = getMaxRho(width, height);
      return {
        x: (params.y * 2 - 1) * maxRho * Math.cos(params.x * Math.PI) + width/2,
        y: (params.y * 2 - 1) * maxRho * Math.sin(params.x * Math.PI) + height/2
      };
    }
  },
  
  "midpoint-theta": {
    id: "midpoint-theta",
    name: "Midpoint-Theta",
    description: {
      overview: "The midpoint-theta parametrization represents lines by their intersection point with the vertical midline and their angle from vertical.",
      parameters: [
        "midpoint: relative vertical position where line crosses x = 0.5",
        "θ: angle from vertical direction (range: -180° to 180°)"
      ],
      equations: [
        "θ = (x - 0.5)·π",
        "m = tan(θ)",
        "midpoint = y_min + y·(y_max - y_min)",
        "b = midpoint - m·0.5",
        "y = mx + b"
      ],
      notes: [
        "The parameter space is normalized to [0,1] for both midpoint and θ",
        "y_min = 0.15, y_max = 0.85 to keep lines visible in the image"
      ]
    },
    paramSpace: {
      xLabel: "θ",
      yLabel: "midpoint",
      xRange: [0, 1],
      yRange: [0.15, 0.85]
    },
    getEndpoints: (params, width, height) => {
      const yRange = [0.15, 0.85];
      const normalizedMidpoint = (params.y - yRange[0]) / (yRange[1] - yRange[0]);
      const thetaRad = (params.x - 0.5) * Math.PI;
      
      const m = Math.tan(thetaRad);
      const b = normalizedMidpoint - m * 0.5;
      
      let x1, y1, x2, y2;
      
      if (Math.abs(m) > 1000) {
        x1 = b * width;
        y1 = 0;
        x2 = b * width;
        y2 = height;
      } else {
        x1 = 0;
        y1 = b * height;
        x2 = width;
        y2 = m * width + b * height;
      }
      
      return [
        { x: x1, y: y1 },
        { x: x2, y: y2 }
      ];
    },
    getParamValues: (params, width, height) => {
      const yRange = [0.15, 0.85];
      const thetaDeg = (params.x - 0.5) * 180;
      const midpoint = yRange[0] + params.y * (yRange[1] - yRange[0]);
      const midpointPixel = midpoint * height;
      return {
        param1: { label: "θ", value: `${thetaDeg.toFixed(1)}°` },
        param2: { label: "midpoint", value: midpointPixel.toFixed(2) }
      };
    },
    getNormalPoint: () => null
  }
};

export const getParametrizationsList = () => 
  Object.values(parametrizations).map(p => ({
    id: p.id,
    name: p.name
  })); 