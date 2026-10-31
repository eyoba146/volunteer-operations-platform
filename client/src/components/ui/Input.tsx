import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, hint, error, leftAddon, rightAddon, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);
    const effectiveLeft = leftAddon || leftIcon;
    const effectiveRight = rightAddon || rightIcon;

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-bold text-ink-primary tracking-tight"
          >
            {label}
            {props.required && <span className="text-role-teamlead ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {effectiveLeft && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-ink-secondary">
              {effectiveLeft}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-white text-ink-primary font-sans text-base border-[1.5px] border-[#475569] rounded-[8px] transition-all duration-150 py-2.5 px-3.5 placeholder:text-ink-tertiary/70 ${
              effectiveLeft ? 'pl-10' : ''
            } ${effectiveRight ? 'pr-10' : ''} ${
              error
                ? 'border-role-teamlead focus:border-role-teamlead focus:ring-1 focus:ring-role-teamlead'
                : 'hover:border-ink-primary focus:border-ink-primary focus:ring-1 focus:ring-ink-primary'
            } outline-none disabled:bg-canvas-subdued disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {effectiveRight && (
            <div className="absolute right-3.5 flex items-center text-ink-secondary">
              {effectiveRight}
            </div>
          )}
        </div>

        {hint && !error && (
          <p className="text-[13px] text-ink-secondary font-sans leading-relaxed">{hint}</p>
        )}
        {error && (
          <p className="text-[13px] text-role-teamlead font-sans font-bold leading-relaxed">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
