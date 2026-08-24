import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: 'sm' | 'md' | 'lg' | boolean;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  glass = 'md',
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseStyle = 'rounded-2xl transition-all duration-200 overflow-hidden';

  let glassStyle = '';
  if (glass === 'sm') glassStyle = 'glass-sm';
  else if (glass === 'lg') glassStyle = 'glass-lg';
  else if (glass === 'md' || glass === true) glassStyle = 'glass-md';
  else glassStyle = 'bg-white dark:bg-[#13151f] border border-slate-200 dark:border-white/8 shadow-sm';

  const hoverStyle = hoverable
    ? 'hover:shadow-md hover:-translate-y-0.5 cursor-pointer'
    : '';

  return (
    <div
      className={`${baseStyle} ${glassStyle} ${hoverStyle} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
