import React from 'react';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { useLocation } from 'react-router-dom';

type TransitionVariant = 'fade-slide' | 'fade-scale' | 'fade' | 'slide';

interface PageTransitionProps {
  children: React.ReactNode;
  variant?: TransitionVariant;
}

const fadeSlide: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  exit:    { opacity: 0, y: -8 },
};

const fadeScale: Variants = {
  initial: { opacity: 0, scale: 0.97 },
  animate: { opacity: 1, scale: 1 },
  exit:    { opacity: 0, scale: 0.98 },
};

const fadeOnly: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
};

const slideOnly: Variants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -10 },
};

const variantMap: Record<TransitionVariant, Variants> = {
  'fade-slide':  fadeSlide,
  'fade-scale':  fadeScale,
  'fade':        fadeOnly,
  'slide':       slideOnly,
};

const transitionMap: Record<TransitionVariant, object> = {
  'fade-slide': { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  'fade-scale': { duration: 0.26, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  'fade':       { duration: 0.22, ease: 'easeInOut' },
  'slide':      { duration: 0.28, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
};

export default function PageTransition({ children, variant = 'fade-slide' }: PageTransitionProps) {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={variantMap[variant]}
        initial="initial"
        animate="animate"
        exit="exit"
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        transition={transitionMap[variant] as any}
        className="w-full"
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
