import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = false,
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded-2xl transition-all duration-300 overflow-hidden';
  const borderStyle = 'border border-slate-100 dark:border-slate-800/60';
  const themeStyle = glass 
    ? 'glass-effect' 
    : 'bg-white dark:bg-slate-900 shadow-sm';
  const hoverStyle = hoverable 
    ? 'hover:scale-[1.015] hover:shadow-md hover:border-slate-200 dark:hover:border-slate-800' 
    : '';

  return (
    <div
      className={`${baseStyle} ${borderStyle} ${themeStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
