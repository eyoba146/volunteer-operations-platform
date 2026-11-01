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
            className="block text-sm font-bold text-ink-primary tracking-tight"
          >
            {label}
            {props.required && <span className="text-role-teamlead ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full text-ink-primary font-sans text-base rounded-[12px] transition-all duration-150 py-2.5 pl-3.5 pr-10 appearance-none ${
              error
                ? 'bg-red-50 text-red-900 focus-visible:ring-2 focus-visible:ring-role-teamlead'
                : 'bg-[#F1F3F6] focus-visible:ring-2 focus-visible:ring-role-volunteer'
            } disabled:opacity-60 disabled:cursor-not-allowed ${className} `}
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

          <div className="absolute right-3.5 flex items-center pointer-events-none text-ink-primary">
            <CaretDown className="w-4 h-4" weight="bold" />
          </div>
        </div>

        {error && (
          <p className="text-[13px] text-role-teamlead font-bold mt-1 leading-relaxed">{error}</p>
        )}

        {!error && hint && (
          <p className="text-[13px] text-ink-secondary mt-1 leading-relaxed">{hint}</p>
        )}
      </div>
    );
  }
);

Select.displayName = 'Select';
