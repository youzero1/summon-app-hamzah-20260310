'use client';

import React from 'react';

interface DisplayProps {
  currentValue: string;
  expression: string;
  isError?: boolean;
}

const Display: React.FC<DisplayProps> = ({ currentValue, expression, isError }) => {
  return (
    <div className="display">
      <div className="display__expression">{expression}</div>
      <div
        className={`display__current${
          isError ? ' display__current--error' : ''
        }`}
      >
        {currentValue}
      </div>
    </div>
  );
};

export default Display;
