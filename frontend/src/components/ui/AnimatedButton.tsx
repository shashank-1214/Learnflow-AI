import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '@/utils/utils';

interface AnimatedButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
}

const variantStyles: Record<string, string> = {
  primary:
    'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md',
  outline:
    'border border-border bg-transparent text-foreground hover:bg-muted hover:border-primary/40',
  ghost:
    'bg-transparent text-foreground hover:bg-muted',
  destructive:
    'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
};

const sizeStyles: Record<string, string> = {
  sm: 'h-8 px-3 text-xs rounded-lg gap-1.5',
  md: 'h-10 px-5 text-sm rounded-xl gap-2',
  lg: 'h-12 px-8 text-base rounded-2xl gap-2.5',
};

/**
 * AnimatedButton — Premium button with:
 * - Framer Motion whileHover lift + scale
 * - whileTap press feedback
 * - Ripple click effect
 * - Loading state with spinner
 * - Reduced motion support
 */
export default function AnimatedButton({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText,
  fullWidth = false,
  className,
  disabled,
  onClick,
  ...rest
}: AnimatedButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);

  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return;

    // Ripple effect
    if (!prefersReducedMotion && btnRef.current) {
      const btn = btnRef.current;
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement('span');
      const diameter = Math.max(btn.clientWidth, btn.clientHeight);
      const radius = diameter / 2;
      ripple.style.cssText = `
        position: absolute;
        width: ${diameter}px; height: ${diameter}px;
        left: ${e.clientX - rect.left - radius}px;
        top: ${e.clientY - rect.top - radius}px;
        background: rgba(255,255,255,0.25);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: ripple 0.55s ease-out forwards;
      `;
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }

    onClick?.(e);
  };

  const isDisabled = disabled || isLoading;

  return (
    <motion.button
      ref={btnRef as React.RefObject<HTMLButtonElement>}
      whileHover={
        prefersReducedMotion || isDisabled
          ? {}
          : { y: -1, scale: 1.015, transition: { duration: 0.15 } }
      }
      whileTap={
        prefersReducedMotion || isDisabled
          ? {}
          : { scale: 0.975, y: 0, transition: { duration: 0.08 } }
      }
      onClick={handleClick}
      disabled={isDisabled}
      className={cn(
        'relative overflow-hidden inline-flex items-center justify-center font-medium',
        'transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'disabled:pointer-events-none disabled:opacity-50',
        variantStyles[variant],
        sizeStyles[size],
        fullWidth && 'w-full',
        className
      )}
      {...(rest as React.ComponentProps<typeof motion.button>)}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin shrink-0 w-4 h-4" />
          <span>{loadingText ?? 'Loading...'}</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}
