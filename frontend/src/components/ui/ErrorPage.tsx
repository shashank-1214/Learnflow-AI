import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Home, RefreshCw, WifiOff, ShieldOff, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ErrorType = '404' | '500' | 'network' | 'unauthorized' | 'session-expired' | 'api-error';

interface ErrorPageProps {
  type?: ErrorType;
  title?: string;
  description?: string;
  onRetry?: () => void;
  onGoHome?: () => void;
}

const errorConfigs: Record<ErrorType, {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
}> = {
  '404': {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: 'Page Not Found',
    description: "The page you're looking for doesn't exist or has been moved.",
    color: 'text-orange-500',
  },
  '500': {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: 'Server Error',
    description: 'Something went wrong on our end. Please try again in a moment.',
    color: 'text-red-500',
  },
  'network': {
    icon: <WifiOff className="w-12 h-12" />,
    title: 'No Connection',
    description: 'Please check your internet connection and try again.',
    color: 'text-gray-500',
  },
  'unauthorized': {
    icon: <ShieldOff className="w-12 h-12" />,
    title: 'Access Denied',
    description: "You don't have permission to access this page.",
    color: 'text-red-500',
  },
  'session-expired': {
    icon: <Clock className="w-12 h-12" />,
    title: 'Session Expired',
    description: 'Your session has timed out. Please sign in again to continue.',
    color: 'text-yellow-500',
  },
  'api-error': {
    icon: <AlertTriangle className="w-12 h-12" />,
    title: 'Something Went Wrong',
    description: 'Unable to load data. Please try again or refresh the page.',
    color: 'text-red-500',
  },
};

export default function ErrorPage({
  type = 'api-error',
  title,
  description,
  onRetry,
  onGoHome,
}: ErrorPageProps) {
  const config = errorConfigs[type];
  const displayTitle = title ?? config.title;
  const displayDesc = description ?? config.description;

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'backOut' }}
        className={`w-24 h-24 rounded-3xl bg-muted flex items-center justify-center mb-8 ${config.color}`}
      >
        <motion.div
          animate={{ rotate: [0, -8, 8, -4, 4, 0] }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {config.icon}
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="space-y-3 mb-8"
      >
        <h2 className="text-3xl font-bold tracking-tight">{displayTitle}</h2>
        <p className="text-muted-foreground max-w-md leading-relaxed">{displayDesc}</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {onRetry && (
          <Button onClick={onRetry} className="rounded-full gap-2 shadow-premium btn-press">
            <RefreshCw className="w-4 h-4" />
            Try Again
          </Button>
        )}
        {onGoHome && (
          <Button variant="outline" onClick={onGoHome} className="rounded-full gap-2">
            <Home className="w-4 h-4" />
            Go Home
          </Button>
        )}
      </motion.div>
    </div>
  );
}
