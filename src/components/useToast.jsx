import React, { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  }, []);

  const ToastComponent = () => {
    if (!toast) return null;
    return (
      <div className={`fixed bottom-6 right-6 z-[9999] px-6 py-4 rounded-xl shadow-2xl border text-label-md font-bold transition-all animate-in slide-in-from-bottom-5 fade-in duration-300 flex items-center gap-3 ${
        toast.type === 'success' 
          ? 'bg-primary text-on-primary border-primary/20' 
          : 'bg-error text-on-error border-error/20'
      }`}>
        <span className="material-symbols-outlined text-[20px]">
          {toast.type === 'success' ? 'check_circle' : 'error'}
        </span>
        {toast.message}
      </div>
    );
  };

  return { showToast, ToastComponent };
}
