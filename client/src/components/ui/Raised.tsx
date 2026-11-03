import React from 'react';

export interface RaisedProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Raised: React.FC<RaisedProps> = ({
  children,
  className = '',
  padding = 'md',
  ...props
}) => {
  const paddingStyles = {
    none: 'p-0',
    sm: 'p-4 sm:p-5',
    md: 'p-6 sm:p-7',
    lg: 'p-8 sm:p-10',
  }[padding];

  return (
    <div
      className={`bg-white rounded-[16px] shadow-[0_1px_2px_rgba(16,24,40,0.05),_0_8px_24px_-12px_rgba(16,24,40,0.10)] ${paddingStyles}  ${className} `}
      {...props}
    >
      {children}
    </div>
  );
};

