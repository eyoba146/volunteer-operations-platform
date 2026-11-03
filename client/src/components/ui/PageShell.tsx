import React from 'react';

export interface PageShellProps {
  page: string;
  signature?: string;
  className?: string;
  children: React.ReactNode;
}

export const PageShell: React.FC<PageShellProps> = ({
  page,
  signature = 'none:standard-page',
  className = '',
  children,
}) => {
  return (
    <div
      data-page={page}
      data-signature={signature}
      className={`min-h-full w-full bg-white text-ink-primary font-sans antialiased ${className} `}
    >
      {children}
    </div>
  );
};

