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
    'inline-flex items-center justify-center font-sans font-bold tracking-tight transition-all duration-100 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-ink-primary focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5 min-h-[38px] rounded-none',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px] rounded-none',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[50px] rounded-none',
    xl: 'text-lg px-8 py-3.5 gap-3 min-h-[56px] rounded-none font-display font-black',
  }[size];

  const variantStyles = {
    primary:
      'bg-ink-primary text-white border-2 border-ink-primary shadow-[4px_4px_0_#111111] hover:shadow-[5px_5px_0_#111111] hover:-translate-x-[1px] hover:-translate-y-[1px] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]',
    secondary:
      'bg-white text-ink-primary border-2 border-ink-primary shadow-[3px_3px_0_#111111] hover:bg-canvas-subdued hover:shadow-[4px_4px_0_#111111] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
    saffron:
      'bg-role-applicant text-ink-primary border-2 border-ink-primary shadow-[4px_4px_0_#111111] hover:bg-[#d67e00] hover:shadow-[5px_5px_0_#111111] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]',
    grass:
      'bg-role-volunteer text-white border-2 border-ink-primary shadow-[4px_4px_0_#111111] hover:bg-[#16693d] hover:shadow-[5px_5px_0_#111111] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]',
    tomato:
      'bg-role-teamlead text-white border-2 border-ink-primary shadow-[4px_4px_0_#111111] hover:bg-[#b82e1e] hover:shadow-[5px_5px_0_#111111] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]',
    teal:
      'bg-role-manager text-white border-2 border-ink-primary shadow-[4px_4px_0_#111111] hover:bg-[#09474a] hover:shadow-[5px_5px_0_#111111] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]',
    telebirr:
      'bg-[#E58B05] text-ink-primary border-2 border-ink-primary shadow-[4px_4px_0_#111111] hover:bg-[#cf7b02] hover:shadow-[5px_5px_0_#111111] active:shadow-none active:translate-x-[3px] active:translate-y-[3px]',
    danger:
      'bg-role-teamlead text-white border-2 border-ink-primary shadow-[3px_3px_0_#111111] hover:bg-[#b82e1e] active:shadow-none active:translate-x-[2px] active:translate-y-[2px]',
    ghost:
      'bg-transparent text-ink-secondary border-2 border-transparent hover:border-ink-primary/20 hover:text-ink-primary hover:bg-canvas-subdued',
    link:
      'bg-transparent text-ink-primary hover:underline p-0 min-h-0 border-none shadow-none',
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
