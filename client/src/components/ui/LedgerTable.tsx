import React from 'react';

export interface LedgerColumn<T> {
  header: React.ReactNode;
  accessorKey?: keyof T;
  cell?: (item: T, index: number) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
  className?: string;
  isMono?: boolean;
}

interface LedgerTableProps<T> {
  data: T[];
  columns: LedgerColumn<T>[];
  keyExtractor: (item: T) => string;
  onRowClick?: (item: T) => void;
  emptyMessage?: string;
  isLoading?: boolean;
  className?: string;
}

export function LedgerTable<T>({
  data,
  columns,
  keyExtractor,
  onRowClick,
  emptyMessage = 'No ledger entries recorded yet.',
  isLoading = false,
  className = '',
}: LedgerTableProps<T>) {
  if (isLoading) {
    return (
      <div className={`border border-border bg-canvas-raised ${className}`}>
        <div className="h-10 bg-canvas-subdued border-b border-border" />
        <div className="p-4 space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-10 bg-[#EFECE4] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`border border-border bg-canvas-raised p-8 text-center text-sm font-sans text-ink-tertiary ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`border border-border bg-canvas-raised overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-border bg-canvas-subdued">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 text-xs font-semibold uppercase tracking-wider text-ink-secondary select-none ${
                  col.align === 'right'
                    ? 'text-right'
                    : col.align === 'center'
                    ? 'text-center'
                    : 'text-left'
                } ${col.className || ''}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {data.map((item, rowIdx) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`transition-colors duration-100 ${
                onRowClick ? 'cursor-pointer hover:bg-canvas-subdued/80' : ''
              } ${rowIdx % 2 === 1 ? 'bg-[#FAF8F4]' : 'bg-canvas-raised'}`}
            >
              {columns.map((col, colIdx) => {
                const value = col.accessorKey ? item[col.accessorKey] : undefined;
                return (
                  <td
                    key={colIdx}
                    className={`py-3 px-4 text-sm font-sans text-ink-primary ${
                      col.isMono ? 'font-mono tabular-nums' : ''
                    } ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${col.className || ''}`}
                  >
                    {col.cell ? col.cell(item, rowIdx) : (value as React.ReactNode)}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

