import React, { createContext, useContext, useState, useCallback } from 'react';
import { Check, Warning, X, Info } from '@phosphor-icons/react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
}

interface ToastContextType {
  toast: (options: Omit<ToastMessage, 'id'>) => void;
  success: (message: string, title?: string) => void;
  error: (message: string, title?: string) => void;
  warning: (message: string, title?: string) => void;
  info: (message: string, title?: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    ({ type, title, message, duration = 4500 }: Omit<ToastMessage, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random()}`;
      const newToast: ToastMessage = { id, type, title, message, duration };

      setToasts((prev) => [...prev, newToast]);

      if (duration > 0) {
        setTimeout(() => {
          removeToast(id);
        }, duration);
      }
    },
    [removeToast]
  );

  const success = useCallback((message: string, title?: string) => {
    toast({ type: 'success', title: title || 'Action completed', message });
  }, [toast]);

  const error = useCallback((message: string, title?: string) => {
    toast({ type: 'error', title: title || 'Notice', message });
  }, [toast]);

  const warning = useCallback((message: string, title?: string) => {
    toast({ type: 'warning', title: title || 'Attention needed', message });
  }, [toast]);

  const info = useCallback((message: string, title?: string) => {
    toast({ type: 'info', title, message });
  }, [toast]);

  return (
    <ToastContext.Provider value={{ toast, success, error, warning, info }}>
      {children}
      {/* Toast container */}
      <div
        className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4 md:px-0"
        aria-live="polite"
      >
        {toasts.map((t) => {
          const typeConfig = {
            success: {
              icon: <Check className="w-3.5 h-3.5 text-emerald-600" weight="bold" />,
              bg: 'bg-emerald-50 text-emerald-600',
            },
            error: {
              icon: <Warning className="w-3.5 h-3.5 text-rose-600" weight="bold" />,
              bg: 'bg-rose-50 text-rose-600',
            },
            warning: {
              icon: <Warning className="w-3.5 h-3.5 text-amber-600" weight="bold" />,
              bg: 'bg-amber-50 text-amber-600',
            },
            info: {
              icon: <Info className="w-3.5 h-3.5 text-brand" weight="bold" />,
              bg: 'bg-brand/10 text-brand',
            },
          }[t.type];

          return (
            <div
              key={t.id}
              className="pointer-events-auto bg-white rounded-[16px] shadow-soft border border-slate-100 p-4 flex items-start gap-3 animate-in slide-in-from-bottom-2 duration-200"
            >
              <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center ${typeConfig.bg}`}>
                {typeConfig.icon}
              </div>
              <div className="flex-1 space-y-0.5 text-left">
                {t.title && (
                  <h4 className="font-sans text-xs font-semibold text-slate-900">
                    {t.title}
                  </h4>
                )}
                <p className="font-sans text-xs text-slate-600 leading-normal">
                  {t.message}
                </p>
              </div>
              <button
                onClick={() => removeToast(t.id)}
                className="shrink-0 p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
                aria-label="Dismiss message"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

