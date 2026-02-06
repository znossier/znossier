'use client';

import { mockTechStack } from '@/lib/mock-data';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';

interface LogoCardProps {
  item: typeof mockTechStack[0];
  reduceMotion: boolean;
  isTopRow: boolean;
}

function LogoCard({ item, reduceMotion, isTopRow }: LogoCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // #region agent log
  useEffect(() => {
    fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:LogoCard:tooltip-state',message:'Tooltip state check',data:{isHovered,mounted,reduceMotion,hasTooltipPosition:!!tooltipPosition,isTopRow,itemId:item.id},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'D'})}).catch(()=>{});
  }, [isHovered, mounted, reduceMotion, tooltipPosition, isTopRow, item.id]);
  // #endregion

  const updateTooltipPosition = () => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    // Get the center of the card
    const centerX = rect.left + rect.width / 2;
    // For top row: position tooltip above the card (accounting for tooltip height ~30px + 8px gap)
    // For bottom row: position tooltip below the card
    // Use top positioning for both, but ensure top row tooltips are positioned correctly above the card
    // Tooltip height is ~28.5px, so we need: cardTop - tooltipHeight - gap = cardTop - 28.5 - 8 = cardTop - 36.5
    const centerY = isTopRow 
      ? Math.max(8, rect.top - 36.5) // Position above the card, but ensure at least 8px from viewport top
      : rect.bottom + 16; // Position below the card
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:updateTooltipPosition',message:'Tooltip position updated',data:{centerX,centerY,isTopRow,rectTop:rect.top,rectBottom:rect.bottom,rectLeft:rect.left,rectWidth:rect.width,itemId:item.id,windowScrollY:window.scrollY,viewportHeight:window.innerHeight},timestamp:Date.now(),sessionId:'debug-session',runId:'run9',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    setTooltipPosition({
      x: centerX,
      y: centerY,
    });
  };

  const handleMouseEnter = () => {
    if (reduceMotion) return;
    setIsHovered(true);
    // #region agent log
    fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:handleMouseEnter',message:'Mouse entered card',data:{isTopRow,itemId:item.id,itemName:item.name,reduceMotion},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'D'})}).catch(()=>{});
    // #endregion
    requestAnimationFrame(updateTooltipPosition);
  };

  const handleMouseMove = () => {
    if (reduceMotion || !isHovered) return;
    
    // Throttle updates
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
    }
    updateTimeoutRef.current = setTimeout(() => {
      requestAnimationFrame(updateTooltipPosition);
    }, 16); // ~60fps
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTooltipPosition(null);
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
  };

  return (
    <>
      <motion.div
        ref={cardRef}
        className="flex-shrink-0 px-2 md:px-3 relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        onMouseEnter={handleMouseEnter}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{ overflow: 'visible' }}
      >
        <motion.div
          className="relative w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 flex items-center justify-center rounded-lg md:rounded-xl bg-background border border-border/60 transition-all duration-300 ease-out hover:border-border"
          animate={{
            scale: isHovered && !reduceMotion ? 1.05 : 1,
          }}
          style={{
            boxShadow: isHovered && !reduceMotion 
              ? '0 8px 20px -4px rgba(0, 0, 0, 0.25), 0 4px 8px -2px rgba(0, 0, 0, 0.15)'
              : 'none',
            overflow: 'visible',
          }}
        >
          <div className="relative w-full h-full p-4 md:p-5 lg:p-6 flex items-center justify-center">
            {item.logo ? (
              <div className="relative w-3/4 h-3/4">
                <Image
                  src={item.logo}
                  alt={item.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 72px, (max-width: 1024px) 84px, 96px"
                />
              </div>
            ) : (
              <span className="text-foreground/60 text-sm font-medium">{item.name.charAt(0)}</span>
            )}
          </div>
        </motion.div>
      </motion.div>

      {/* Tooltip */}
      {mounted && isHovered && !reduceMotion && tooltipPosition && createPortal(
        <motion.div
          key={`tooltip-${item.id}`}
          initial={{ opacity: 0, y: isTopRow ? -4 : 4, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: isTopRow ? -4 : 4, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className="fixed z-[9999] px-3 py-1.5 bg-background border border-border text-foreground text-xs font-medium rounded-lg whitespace-nowrap pointer-events-none shadow-lg"
          style={{ 
            left: `${tooltipPosition.x}px`,
            top: `${tooltipPosition.y}px`,
            transform: 'translate(-50%, 0)',
            transition: 'left 0.15s cubic-bezier(0.4, 0, 0.2, 1), top 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
          ref={(el) => {
            // #region agent log
            if (el) {
              const tooltipRect = el.getBoundingClientRect();
              fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:tooltip-render',message:'Tooltip rendered',data:{tooltipTop:tooltipRect.top,tooltipBottom:tooltipRect.bottom,tooltipLeft:tooltipRect.left,tooltipWidth:tooltipRect.width,tooltipHeight:tooltipRect.height,viewportHeight:window.innerHeight,isTopRow,itemId:item.id,positionY:tooltipPosition.y},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'D'})}).catch(()=>{});
            }
            // #endregion
          }}
        >
          {item.name}
        </motion.div>,
        document.body
      )}
    </>
  );
}

interface ParallaxRowProps {
  items: typeof mockTechStack;
  speed: number;
  direction: 'left' | 'right';
  reduceMotion: boolean;
  isTopRow: boolean;
}

function ParallaxRow({ items, speed, direction, reduceMotion, isTopRow }: ParallaxRowProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const baseX = useMotionValue(0);
  const [totalWidth, setTotalWidth] = useState<number>(0);
  
  // Create duplicates for seamless loop
  const duplicatedItems = Array(6).fill(items).flat();
  
  // Measure actual total width of one complete set of items
  useEffect(() => {
    const measureWidth = () => {
      if (containerRef.current) {
        // Find all cards in the first set (first items.length cards)
        const allCards = containerRef.current.querySelectorAll('[data-card]');
        if (allCards.length >= items.length) {
          // Measure using offsetLeft/offsetWidth for container-relative measurements
          const firstCard = allCards[0] as HTMLElement;
          const lastCardInSet = allCards[items.length - 1] as HTMLElement;
          
          if (firstCard && lastCardInSet) {
            // Calculate total width: last card's left position + its width - first card's left position
            const firstCardLeft = firstCard.offsetLeft;
            const lastCardLeft = lastCardInSet.offsetLeft;
            const lastCardWidth = lastCardInSet.offsetWidth;
            const measuredTotalWidth = (lastCardLeft + lastCardWidth) - firstCardLeft;
            // Round to nearest pixel to avoid sub-pixel rendering issues
            const roundedWidth = Math.round(measuredTotalWidth);
            setTotalWidth(roundedWidth);
            // #region agent log
            fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:measureWidth',message:'Width measured',data:{measuredTotalWidth,firstCardLeft,lastCardLeft,lastCardWidth,itemsCount:items.length,direction,isTopRow},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'B'})}).catch(()=>{});
            // #endregion
          }
        }
      }
    };
    
    // Multiple attempts to ensure measurement
    const timeout1 = setTimeout(measureWidth, 100);
    const timeout2 = setTimeout(measureWidth, 500);
    const timeout3 = setTimeout(measureWidth, 1000);
    window.addEventListener('resize', measureWidth);
    return () => {
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(timeout3);
      window.removeEventListener('resize', measureWidth);
    };
  }, [items.length, direction, isTopRow]);
  
  useAnimationFrame((t, delta) => {
    if (reduceMotion || !containerRef.current || totalWidth === 0) return;
    
    const frameSpeed = (delta / 16.67) * speed;
    const currentX = baseX.get();
    const newX = direction === 'left' 
      ? currentX - frameSpeed 
      : currentX + frameSpeed;
    
    // Reset for seamless loop
    if (direction === 'left') {
      if (newX <= -totalWidth) {
        // For left direction, use modulo to continue negative motion smoothly
        // Example: -1152 % 1008 = -144, which continues leftward seamlessly
        const wrappedX = newX % totalWidth;
        baseX.set(wrappedX);
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:useAnimationFrame',message:'Loop reset left',data:{newX,totalWidth,resetValue:wrappedX,direction,isTopRow},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      } else {
        baseX.set(newX);
      }
    } else {
      // Right direction
      if (newX >= totalWidth) {
        // Use modulo wrapping with rounded width for seamless loop
        // Round the result to eliminate sub-pixel errors
        const wrappedX = newX % totalWidth;
        const roundedX = Math.round(wrappedX * 100) / 100; // Round to 2 decimal places
        baseX.set(roundedX);
        // #region agent log
        fetch('http://127.0.0.1:7247/ingest/f07d0baf-6074-4723-bff0-e8558354fee1',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'TechStack.tsx:useAnimationFrame',message:'Loop reset right',data:{newX,totalWidth,resetValue:roundedX,wrappedX,direction,isTopRow},timestamp:Date.now(),sessionId:'debug-session',runId:'run7',hypothesisId:'B'})}).catch(()=>{});
        // #endregion
      } else {
        baseX.set(newX);
      }
    }
  });
  
  const x = useTransform(baseX, (value) => reduceMotion ? 0 : value);

  return (
    <div 
      className={`${isTopRow ? 'pt-32 pb-8' : 'pb-32 pt-8'}`}
      style={{ overflow: 'hidden', position: 'relative' }}
    >
      <motion.div
        ref={containerRef}
        style={{ 
          x, 
          willChange: reduceMotion ? 'auto' : 'transform',
          paddingLeft: '1rem',
          paddingRight: '1rem',
        }}
        className="flex"
      >
        {duplicatedItems.map((item, index) => (
          <div key={`${item.id}-${index}`} data-card style={{ marginRight: '0.5rem' }}>
            <LogoCard
              item={item}
              reduceMotion={reduceMotion}
              isTopRow={isTopRow}
            />
          </div>
        ))}
      </motion.div>
    </div>
  );
}

export function TechStack() {
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mm = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mm.matches);
    const handleChange = () => setReduceMotion(mm.matches);
    mm.addEventListener('change', handleChange);
    return () => mm.removeEventListener('change', handleChange);
  }, []);

  const midPoint = Math.ceil(mockTechStack.length / 2);
  const row1 = mockTechStack.slice(0, midPoint);
  const row2 = mockTechStack.slice(midPoint);

  return (
    <section
      id="tech-stack"
      className="py-16 md:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 relative bg-background z-20"
      style={{ overflow: 'visible' }}
    >
      <div className="mx-auto max-w-7xl w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.5 }}
          className="mb-10 md:mb-12"
        >
          <div className="flex items-center gap-4 md:gap-6">
            <div className="w-12 md:w-16 border-t border-border"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
              Tech Stack
            </h2>
          </div>
        </motion.div>

        <div className="space-y-6 md:space-y-8" style={{ overflow: 'visible', position: 'relative' }}>
          <ParallaxRow
            items={row1}
            speed={1.0}
            direction="left"
            reduceMotion={reduceMotion}
            isTopRow={true}
          />
          
          <ParallaxRow
            items={row2}
            speed={1.0}
            direction="right"
            reduceMotion={reduceMotion}
            isTopRow={false}
          />
        </div>
      </div>
    </section>
  );
}
