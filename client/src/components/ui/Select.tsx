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
            className="block text-xs font-semibold uppercase tracking-wider text-ink-secondary"
          >
            {label}
            {props.required && <span className="text-civic-rust ml-1">*</span>}
          </label>
        )}

        <div className="relative flex items-center">
          <select
            ref={ref}
            id={selectId}
            className={`w-full bg-canvas-raised text-ink-primary font-sans text-sm rounded border transition-colors duration-150 py-2 pl-3 pr-9 appearance-none ${
              error
                ? 'border-civic-rust focus:border-civic-rust focus:ring-1 focus:ring-civic-rust'
                : 'border-border hover:border-ink-secondary/70 focus:border-ink-primary focus:ring-1 focus:ring-ink-primary'
            } outline-none disabled:bg-canvas-subdued disabled:cursor-not-allowed ${className}`}
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

