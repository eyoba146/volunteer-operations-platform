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
  emptyMessage = 'No records found.',
  isLoading = false,
  className = '',
}: LedgerTableProps<T>) {
  if (isLoading) {
    return (
      <div className={`space-y-2 py-4 ${className}`}>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-12 bg-[#F7F8FA] rounded-[8px] animate-pulse" />
        ))}
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className={`p-8 text-center text-sm font-sans text-ink-secondary ${className}`}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-[#EDEFF2]">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`py-3 px-4 text-sm font-medium text-slate-500 select-none ${
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
        <tbody className="divide-y divide-[#EDEFF2]">
          {data.map((item, rowIdx) => (
            <tr
              key={keyExtractor(item)}
              onClick={() => onRowClick && onRowClick(item)}
              className={`transition-colors duration-100 ${
                onRowClick ? 'cursor-pointer hover:bg-[#F7F8FA]' : ''
              }`}
            >
              {columns.map((col, colIdx) => {
                const value = col.accessorKey ? item[col.accessorKey] : undefined;
                return (
                  <td
                    key={colIdx}
                    className={`py-3.5 px-4 text-sm font-sans text-ink-primary ${
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
