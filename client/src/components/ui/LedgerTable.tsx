import React from 'react';

export interface LedgerColumn<T> {
  header: string;
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
  emptyMessage = 'No entries recorded yet.',
  isLoading = false,
  className = '',
}: LedgerTableProps<T>) {
  if (isLoading) {
    return (
      <div className={`bg-white rounded-[24px] shadow-soft border border-slate-100 p-6 space-y-4 ${className}`}>
        <div className="h-6 w-1/4 bg-slate-100 rounded-full animate-pulse" />
        <div className="space-y-3 pt-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-50 rounded-[14px] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div
        className={`bg-white rounded-[24px] shadow-soft border border-slate-100 p-12 text-center text-sm font-sans text-slate-500 ${className}`}
      >
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-[24px] shadow-soft border border-slate-100 overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50/70">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3.5 px-6 font-sans text-xs font-semibold text-slate-500 tracking-tight ${
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
        <tbody className="divide-y divide-slate-100">
          {data.map((item, rowIdx) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`transition-colors duration-150 ${
                onRowClick ? 'cursor-pointer hover:bg-slate-50/80' : 'hover:bg-slate-50/40'
              }`}
            >
              {columns.map((col, colIdx) => {
                const value = col.accessorKey ? (item[col.accessorKey] as React.ReactNode) : null;
                return (
                  <td
                    key={colIdx}
                    className={`py-4 px-6 text-sm text-slate-800 ${
                      col.isMono ? 'font-mono text-xs' : 'font-sans'
                    } ${
                      col.align === 'right'
                        ? 'text-right'
                        : col.align === 'center'
                        ? 'text-center'
                        : 'text-left'
                    } ${col.className || ''}`}
                  >
                    {col.cell ? col.cell(item, rowIdx) : value}
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
