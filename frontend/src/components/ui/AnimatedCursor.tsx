import React, { useEffect, useRef, useState } from 'react';

/**
 * AnimatedCursor — Premium custom cursor with glowing dot + outer ring.
 * Automatically disabled on touch/mobile devices.
 */
export default function AnimatedCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [hovering, setHovering] = useState(false);
  const posRef = useRef({ x: 0, y: 0 });
  const ringPos = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  // Don't render on touch devices
  const isTouch = typeof window !== 'undefined' &&
    window.matchMedia('(pointer: coarse)').matches;

  useEffect(() => {
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const onMouseMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
      if (!visible) setVisible(true);

      // Snap dot immediately
      dot.style.left = `${e.clientX}px`;
      dot.style.top = `${e.clientY}px`;
    };

    const onMouseDown = () => setClicked(true);
    const onMouseUp = () => setClicked(false);

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest('button') ||
        target.closest('a') ||
        target.closest('[data-cursor="pointer"]') ||
        target.closest('input') ||
        target.closest('textarea') ||
        target.closest('select');
      setHovering(!!isInteractive);
    };

    // RAF loop for ring lag
    const animate = () => {
      ringPos.current.x += (posRef.current.x - ringPos.current.x) * 0.12;
      ringPos.current.y += (posRef.current.y - ringPos.current.y) * 0.12;
      ring.style.left = `${ringPos.current.x}px`;
      ring.style.top = `${ringPos.current.y}px`;
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseover', onMouseOver);
    document.body.style.cursor = 'none';

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseover', onMouseOver);
      document.body.style.cursor = '';
      cancelAnimationFrame(rafRef.current);
    };
  }, [isTouch, visible]);

  if (isTouch) return null;

  return (
    <>
      {/* Dot */}
      <div
        ref={dotRef}
        className="fixed pointer-events-none z-[99999] -translate-x-1/2 -translate-y-1/2 transition-none"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className={`rounded-full bg-primary transition-all duration-150 ease-out ${
            clicked
              ? 'w-2 h-2 opacity-60'
              : hovering
              ? 'w-3 h-3 shadow-[0_0_8px_2px_rgba(59,130,246,0.6)]'
              : 'w-2.5 h-2.5 shadow-[0_0_6px_1px_rgba(59,130,246,0.4)]'
          }`}
        />
      </div>

      {/* Ring */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[99998] -translate-x-1/2 -translate-y-1/2 transition-none"
        style={{ opacity: visible ? 1 : 0 }}
      >
        <div
          className={`rounded-full border-2 border-primary/40 transition-all duration-300 ease-out ${
            clicked
              ? 'w-5 h-5 border-primary/20'
              : hovering
              ? 'w-10 h-10 border-primary/60 bg-primary/5'
              : 'w-8 h-8 border-primary/30'
          }`}
        />
      </div>
    </>
  );
}
