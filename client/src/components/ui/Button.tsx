import React from 'react';
import { CircleNotch } from '@phosphor-icons/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'saffron' | 'grass' | 'tomato' | 'teal' | 'telebirr' | 'danger' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-sans font-semibold tracking-tight transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-ink-primary focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 min-h-[34px] rounded-none',
    md: 'text-sm px-4 py-2.5 gap-2 min-h-[42px] rounded-none',
    lg: 'text-base px-6 py-3.5 gap-2.5 min-h-[50px] rounded-none',
    xl: 'text-lg px-8 py-4 gap-3 min-h-[58px] rounded-none font-bold',
  }[size];

  const variantStyles = {
    primary:
      'bg-ink-primary text-white hover:bg-black active:translate-y-[1px] shadow-sm hover:-translate-y-0.5',
    secondary:
      'bg-white text-ink-primary border-2 border-ink-primary hover:bg-canvas-subdued active:translate-y-[1px] shadow-sm hover:-translate-y-0.5',
    saffron:
      'bg-role-applicant text-ink-primary font-bold hover:bg-[#cf7b02] active:translate-y-[1px] shadow-sm hover:-translate-y-0.5',
    grass:
      'bg-role-volunteer text-white font-bold hover:bg-[#186b3e] active:translate-y-[1px] shadow-sm hover:-translate-y-0.5',
    tomato:
      'bg-role-teamlead text-white font-bold hover:bg-[#be3121] active:translate-y-[1px] shadow-sm hover:-translate-y-0.5',
    teal:
      'bg-role-manager text-white font-bold hover:bg-[#0a4d50] active:translate-y-[1px] shadow-sm hover:-translate-y-0.5',
    telebirr:
      'bg-[#E58B05] text-ink-primary font-bold hover:brightness-105 active:translate-y-[1px] shadow-sm hover:-translate-y-0.5',
    danger:
      'bg-role-teamlead text-white hover:bg-[#be3121] active:translate-y-[1px]',
    ghost:
      'bg-transparent text-ink-secondary hover:text-ink-primary hover:bg-canvas-subdued/80',
    link:
      'bg-transparent text-ink-primary hover:underline p-0 min-h-0',
  }[variant];

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <CircleNotch className="w-4 h-4 animate-spin text-current" />
      ) : (
        leftIcon
      )}
      <span>{children}</span>
      {!isLoading && rightIcon}
    </button>
  );
};
