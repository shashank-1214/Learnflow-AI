import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface LoadingBarProps {
  isLoading: boolean;
}

/**
 * LoadingBar — Thin gradient bar fixed to the top of the viewport.
 * Shows an indeterminate shimmer animation while `isLoading` is true.
 * Fades out smoothly when loading completes.
 */
export default function LoadingBar({ isLoading }: LoadingBarProps) {
  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          key="loading-bar"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed top-0 left-0 right-0 z-[99998] h-[3px] overflow-hidden"
          aria-hidden="true"
        >
          <motion.div
            className="h-full w-full bg-gradient-to-r from-transparent via-primary to-accent"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
