'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useToast } from '@/hooks/useToast';
import ToastContainer from '@/components/ui/ToastContainer';

interface ToastContextType {
  success: (message: string, duration?: number) => void;
  error: (message: string, duration?: number) => void;
  warning: (message: string, duration?: number) => void;
  info: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const { success, error, warning, info } = useToast();

  return (
    <ToastContext.Provider value={{ success, error, warning, info }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToastContext must be used within a ToastProvider');
  }
  return context;
};