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
    'inline-flex items-center justify-center font-sans font-bold tracking-tight transition-all duration-150 cursor-pointer select-none disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-ink-primary focus-visible:outline-offset-2';

  const sizeStyles = {
    sm: 'text-[13px] px-3.5 py-1.5 gap-1.5 min-h-[38px] rounded-[8px]',
    md: 'text-sm px-5 py-2.5 gap-2 min-h-[44px] rounded-[8px]',
    lg: 'text-base px-6 py-3 gap-2.5 min-h-[50px] rounded-[8px]',
    xl: 'text-base sm:text-lg px-7 py-3.5 gap-3 min-h-[54px] rounded-[8px] font-sans font-bold',
  }[size];

  const variantStyles = {
    primary:
      'bg-ink-primary text-white border border-ink-primary rounded-[8px] hover:bg-[#202328] active:translate-y-[1px] shadow-none',
    secondary:
      'bg-white text-ink-primary border-[1.5px] border-[#374151] rounded-[8px] hover:bg-canvas-subdued active:translate-y-[1px] shadow-none',
    saffron:
      'bg-role-applicant text-ink-primary border border-ink-primary rounded-[8px] hover:bg-[#d67e00] active:translate-y-[1px] shadow-none',
    grass:
      'bg-role-volunteer text-white border border-ink-primary rounded-[8px] hover:bg-[#16693d] active:translate-y-[1px] shadow-none',
    tomato:
      'bg-role-teamlead text-white border border-ink-primary rounded-[8px] hover:bg-[#b82e1e] active:translate-y-[1px] shadow-none',
    teal:
      'bg-role-manager text-white border border-ink-primary rounded-[8px] hover:bg-[#09474a] active:translate-y-[1px] shadow-none',
    telebirr:
      'bg-[#E58B05] text-ink-primary border border-ink-primary rounded-[8px] hover:bg-[#cf7b02] active:translate-y-[1px] shadow-none',
    danger:
      'bg-role-teamlead text-white border border-ink-primary rounded-[8px] hover:bg-[#b82e1e] active:translate-y-[1px] shadow-none',
    ghost:
      'bg-transparent text-ink-secondary border border-transparent rounded-[8px] hover:bg-canvas-subdued hover:text-ink-primary shadow-none',
    link:
      'bg-transparent text-ink-primary hover:underline p-0 min-h-0 border-none shadow-none rounded-none',
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
