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
            className="block text-xs font-bold uppercase tracking-tight text-ink-primary"
          >
            {label}
            {props.required && <span className="text-role-teamlead ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {effectiveLeft && (
            <div className="absolute left-3 flex items-center pointer-events-none text-ink-tertiary">
              {effectiveLeft}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-canvas-raised text-ink-primary font-sans text-sm border-2 border-border transition-colors duration-150 py-2.5 px-3 placeholder:text-ink-tertiary/60 ${
              effectiveLeft ? 'pl-9' : ''
            } ${effectiveRight ? 'pr-9' : ''} ${
              error
                ? 'border-role-teamlead focus:border-role-teamlead focus:ring-1 focus:ring-role-teamlead'
                : 'hover:border-ink-secondary focus:border-ink-primary focus:ring-1 focus:ring-ink-primary'
            } outline-none disabled:bg-canvas-subdued disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {effectiveRight && (
            <div className="absolute right-3 flex items-center text-ink-tertiary">
              {effectiveRight}
            </div>
          )}
        </div>

        {hint && !error && (
          <p className="text-xs text-ink-tertiary font-sans">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-role-teamlead font-sans font-bold">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
