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
    'inline-flex items-center justify-center font-sans font-medium tracking-tight transition-all duration-200 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-2 focus-visible:outline-brand focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[36px] rounded-full',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px] rounded-full',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[48px] rounded-full font-semibold',
    xl: 'text-lg px-8 py-3.5 gap-3 min-h-[54px] rounded-full font-bold',
  }[size];

  const variantStyles = {
    primary:
      'bg-brand text-white hover:bg-brand-hover active:translate-y-0 shadow-pill hover:shadow-soft hover:-translate-y-0.5',
    secondary:
      'bg-white text-slate-800 border border-slate-200/90 hover:bg-slate-50/80 active:translate-y-0 shadow-pill hover:-translate-y-0.5',
    saffron:
      'bg-role-applicant text-white hover:brightness-105 active:translate-y-0 shadow-pill hover:-translate-y-0.5',
    grass:
      'bg-role-volunteer text-white hover:brightness-105 active:translate-y-0 shadow-pill hover:-translate-y-0.5',
    tomato:
      'bg-role-teamlead text-white hover:brightness-105 active:translate-y-0 shadow-pill hover:-translate-y-0.5',
    teal:
      'bg-role-manager text-white hover:brightness-105 active:translate-y-0 shadow-pill hover:-translate-y-0.5',
    telebirr:
      'bg-[#E58B05] text-white hover:brightness-105 active:translate-y-0 shadow-pill hover:-translate-y-0.5',
    danger:
      'bg-red-600 text-white hover:bg-red-700 shadow-pill',
    ghost:
      'bg-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-100/70',
    link:
      'bg-transparent text-brand hover:underline p-0 min-h-0',
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
