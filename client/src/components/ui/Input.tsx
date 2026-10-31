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
            className="block text-xs font-semibold text-slate-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          {effectiveLeft && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {effectiveLeft}
            </div>
          )}

          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-white text-slate-900 font-sans text-sm rounded-[14px] border border-slate-200/90 shadow-sm transition-all duration-150 py-2.5 px-3.5 placeholder:text-slate-400 ${
              effectiveLeft ? 'pl-10' : ''
            } ${effectiveRight ? 'pr-10' : ''} ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                : 'hover:border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/15'
            } outline-none disabled:bg-slate-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          />

          {effectiveRight && (
            <div className="absolute right-3.5 flex items-center text-slate-400">
              {effectiveRight}
            </div>
          )}
        </div>

        {hint && !error && (
          <p className="text-xs text-slate-500 font-sans">{hint}</p>
        )}
        {error && (
          <p className="text-xs text-role-teamlead font-sans font-bold">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';
