import React from 'react';

const MathDescription = ({ description }) => {
  const { overview, parameters, equations, notes } = description;
  
  return (
    <div className="space-y-4">
      <p className="text-gray-700 dark:text-gray-300">
        {overview}
      </p>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded border border-gray-200 dark:border-gray-700 space-y-4">
        <div>
          <h4 className="font-semibold mb-2 dark:text-white">Parameters</h4>
          <div className="space-y-1">
            {parameters.map((param, i) => (
              <p key={i} className="text-gray-700 dark:text-gray-300">{param}</p>
            ))}
          </div>
        </div>
        
        {equations && (
          <div>
            <h4 className="font-semibold mb-2 dark:text-white">Equations</h4>
            <div className="space-y-1 font-mono bg-gray-50 dark:bg-gray-900 p-2 rounded">
              {equations.map((eq, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300">{eq}</p>
              ))}
            </div>
          </div>
        )}
        
        {notes && (
          <div>
            <h4 className="font-semibold mb-2 dark:text-white">Notes</h4>
            <div className="space-y-1">
              {notes.map((note, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300">{note}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathDescription; 