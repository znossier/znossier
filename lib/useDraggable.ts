'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface UseDraggableOptions {
  initialPosition?: { x: number; y: number };
  storageKey?: string;
  bounds?: {
    minX?: number;
    maxX?: number;
    minY?: number;
    maxY?: number;
  };
}

export function useDraggable(options: UseDraggableOptions = {}) {
  const {
    initialPosition,
    storageKey = 'vinyl-player-position',
    bounds,
  } = options;

  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    // Try to restore from localStorage
    if (typeof window !== 'undefined' && storageKey) {
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          // Invalid JSON, use default
        }
      }
    }
    return initialPosition || { x: 0, y: 0 };
  });

  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const elementRef = useRef<HTMLElement | null>(null);

  // Save position to localStorage
  useEffect(() => {
    if (storageKey && typeof window !== 'undefined') {
      localStorage.setItem(storageKey, JSON.stringify(position));
    }
  }, [position, storageKey]);

  // Calculate bounds based on viewport and element size
  const getConstrainedPosition = useCallback(
    (x: number, y: number) => {
      if (!elementRef.current) return { x, y };

      const rect = elementRef.current.getBoundingClientRect();
      const maxX = bounds?.maxX ?? window.innerWidth - rect.width;
      const maxY = bounds?.maxY ?? window.innerHeight - rect.height;
      const minX = bounds?.minX ?? 0;
      const minY = bounds?.minY ?? 0;

      return {
        x: Math.max(minX, Math.min(maxX, x)),
        y: Math.max(minY, Math.min(maxY, y)),
      };
    },
    [bounds]
  );

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
  }, [position]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartPos.current = {
      x: touch.clientX - position.x,
      y: touch.clientY - position.y,
    };
  }, [position]);

  useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e: MouseEvent) => {
      const newX = e.clientX - dragStartPos.current.x;
      const newY = e.clientY - dragStartPos.current.y;
      const constrained = getConstrainedPosition(newX, newY);
      setPosition(constrained);
    };

    const handleTouchMove = (e: TouchEvent) => {
      const touch = e.touches[0];
      const newX = touch.clientX - dragStartPos.current.x;
      const newY = touch.clientY - dragStartPos.current.y;
      const constrained = getConstrainedPosition(newX, newY);
      setPosition(constrained);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    const handleTouchEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isDragging, getConstrainedPosition]);

  return {
    position,
    isDragging,
    elementRef,
    handleMouseDown,
    handleTouchStart,
  };
}
