import React, { createContext, useContext, useState, useCallback } from 'react';

interface LoadingContextValue {
  isLoading: boolean;
  message: string;
  show: (message?: string) => void;
  hide: () => void;
}

const LoadingContext = createContext<LoadingContextValue>({
  isLoading: false,
  message: 'Preparing your AI Workspace...',
  show: () => {},
  hide: () => {},
});

export function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Preparing your AI Workspace...');

  const show = useCallback((msg = 'Preparing your AI Workspace...') => {
    setMessage(msg);
    setIsLoading(true);
  }, []);

  const hide = useCallback(() => {
    setIsLoading(false);
  }, []);

  return (
    <LoadingContext.Provider value={{ isLoading, message, show, hide }}>
      {children}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  return useContext(LoadingContext);
}
