import React, { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/utils';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  /** Delay for staggered scroll entrance, in seconds */
  delay?: number;
  /** Enable mouse-tracking radial glow */
  glow?: boolean;
  /** Glow color in rgba format, default is primary blue */
  glowColor?: string;
  onClick?: () => void;
  'data-cursor'?: string;
}

/**
 * AnimatedCard — Premium card with:
 * - Scroll-triggered entrance via Intersection Observer
 * - Mouse-tracking radial glow that follows cursor
 * - Framer Motion whileHover lift + border highlight
 * - whileTap press feedback
 */
export default function AnimatedCard({
  children,
  className,
  delay = 0,
  glow = true,
  glowColor = 'rgba(59, 130, 246, 0.12)',
  onClick,
  ...rest
}: AnimatedCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number } | null>(null);

  // Intersection Observer for scroll-triggered entrance
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.unobserve(el);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!glow || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos(null);
  };

  // Respect reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <motion.div
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={rest['data-cursor']}
      initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
      animate={visible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.35, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={prefersReducedMotion ? {} : { y: -4, transition: { duration: 0.2 } }}
      whileTap={prefersReducedMotion ? {} : { scale: 0.985, transition: { duration: 0.1 } }}
      className={cn('relative overflow-hidden', className)}
      style={{ isolation: 'isolate' }}
    >
      {/* Mouse glow radial overlay */}
      {glow && mousePos && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, ${glowColor}, transparent 70%)`,
          }}
        />
      )}
      {/* Content */}
      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
