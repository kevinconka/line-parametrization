import React from 'react';

const MathDescription = ({ description }) => {
  const { overview, parameters, equations, notes } = description;
  
  return (
    <div className="space-y-4 w-full">
      {/* Overview */}
      <div className="flex justify-center px-2">
        <p className="text-gray-700 dark:text-gray-300 text-center text-sm sm:text-base">
          {overview}
        </p>
      </div>
      
      {/* Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-4">
          {/* Parameters Section */}
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 sm:mb-3 dark:text-white text-sm sm:text-base">Parameters</h4>
            <div className="space-y-2">
              {parameters.map((param, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{param}</p>
              ))}
            </div>
          </div>

          {/* Notes Section */}
          {notes && notes.length > 0 && (
            <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded border border-gray-200 dark:border-gray-700">
              <h4 className="font-semibold mb-2 sm:mb-3 dark:text-white text-sm sm:text-base">Notes</h4>
              <div className="space-y-2">
                {notes.map((note, i) => (
                  <p key={i} className="text-gray-700 dark:text-gray-300 text-sm sm:text-base">{note}</p>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Equations */}
        {equations && equations.length > 0 && (
          <div className="bg-white dark:bg-gray-800 p-3 sm:p-4 rounded border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2 sm:mb-3 dark:text-white text-sm sm:text-base">Equations</h4>
            <div className="space-y-2 font-mono bg-gray-50 dark:bg-gray-900 p-2 sm:p-3 rounded text-sm sm:text-base">
              {equations.map((eq, i) => (
                <p key={i} className="text-gray-700 dark:text-gray-300">{eq}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MathDescription; 