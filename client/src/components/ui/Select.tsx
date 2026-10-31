import React, { forwardRef } from 'react';
import { CaretDown } from '@phosphor-icons/react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  hint?: string;
  error?: string;
  options?: SelectOption[];
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, hint, error, options, children, className = '', id, ...props }, ref) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

    return (
      <div className="w-full space-y-1.5 text-left">
        {label && (
          <label
            htmlFor={selectId}
            className="block text-xs font-semibold text-slate-700"
          >
            {label}
            {props.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full bg-white text-slate-900 font-sans text-sm rounded-[14px] border border-slate-200/90 shadow-sm transition-all duration-150 py-2.5 pl-3.5 pr-10 appearance-none ${
              error
                ? 'border-red-500 focus:border-red-500 focus:ring-2 focus:ring-red-500/15'
                : 'border-slate-200/90 hover:border-slate-300 focus:border-brand focus:ring-2 focus:ring-brand/15'
            } outline-none disabled:bg-slate-50 disabled:cursor-not-allowed ${className}`}
            {...props}
          >
            {options
              ? options.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))
              : children}
          </select>

          <div className="absolute right-3 flex items-center pointer-events-none text-ink-tertiary">
            <CaretDown className="w-4 h-4" />
          </div>
        </div>

        {error && (
          <p className="text-xs text-civic-rust font-medium mt-1">{error}</p>
        )}

        {!error && hint && (
          <p className="text-xs text-ink-tertiary mt-1">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';

