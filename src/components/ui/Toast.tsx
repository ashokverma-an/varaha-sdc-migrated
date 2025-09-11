'use client';

import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'warning';
  isVisible: boolean;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type, isVisible, onClose }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose]);

  if (!isVisible) return null;

  const icons = {
    success: CheckCircle,
    error: XCircle,
    warning: AlertCircle
  };

  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800'
  };

  const Icon = icons[type];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-300">
      <div className={`flex items-center p-4 border rounded-lg shadow-lg ${colors[type]} min-w-80`}>
        <Icon className="h-5 w-5 mr-3 flex-shrink-0" />
        <p className="text-sm font-medium flex-1">{message}</p>
        <button
          onClick={onClose}
          className="ml-3 p-1 hover:bg-black/10 rounded-full transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

export const useToast = () => {
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'warning';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const showToast = (message: string, type: 'success' | 'error' | 'warning' = 'success') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  return { toast, showToast, hideToast };
};