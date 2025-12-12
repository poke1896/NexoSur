"use client";

import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ToastContext = createContext({ show: () => {} });

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((message, { type = 'info', duration = 3000 } = {}) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, message, type }]);
    if (duration > 0) setTimeout(() => remove(id), duration);
  }, [remove]);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="fixed inset-x-0 bottom-4 z-50 flex justify-center px-4 pointer-events-none">
        <div className="space-y-2 w-full max-w-md">
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto rounded-md border px-3 py-2 shadow-md text-sm text-white ${
                t.type === 'success'
                  ? 'bg-green-600 border-green-700'
                  : t.type === 'error'
                  ? 'bg-red-600 border-red-700'
                  : t.type === 'warning'
                  ? 'bg-amber-600 border-amber-700'
                  : 'bg-gray-900 border-gray-800'
              }`}
            >
              {t.message}
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
