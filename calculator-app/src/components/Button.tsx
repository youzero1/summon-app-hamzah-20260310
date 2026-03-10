'use client';

import React from 'react';

type ButtonVariant = 'number' | 'operator' | 'equals' | 'clear';

interface ButtonProps {
  label: string;
  onClick: () => void;
  variant?: ButtonVariant;
  spanTwo?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  variant = 'number',
  spanTwo = false,
}) => {
  const classNames = [
    'calc-button',
    `calc-button--${variant}`,
    spanTwo ? 'calc-button--span2' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button className={classNames} onClick={onClick} aria-label={label}>
      {label}
    </button>
  );
};

export default Button;
