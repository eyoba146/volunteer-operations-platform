import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'avatar' | 'row';
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'rect',
}) => {
  const base = 'animate-pulse bg-[#EFECE4] rounded-[12px]';

  const variants = {
    text: 'h-4 w-full rounded-none',
    rect: 'h-24 w-full rounded-none',
    avatar: 'w-10 h-10 rounded-none shrink-0',
    row: 'h-12 w-full rounded-none',
  }[variant];

  return <div className={` ${base}  ${variants}  ${className} `} />;
};

