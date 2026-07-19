'use client';

import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { EASE_PRECISION, MOTION } from '@/lib/motion';

const SESSION_KEY = 'zn-boot-seen';
const FILE_NAME = 'Zeina Nossier — Portfolio';
const FRAME_LABEL = 'Home';
const FRAME_SIZE = '1440 × 900';
const LAYER_ROWS = [
  { depth: 0, label: 'Home', w: '42%' },
  { depth: 1, label: 'Hero', w: '34%' },
  { depth: 1, label: 'Works', w: '38%' },
  { depth: 2, label: 'Card / 01', w: '48%' },
  { depth: 2, label: 'Card / 02', w: '44%' },
  { depth: 1, label: 'Expertise', w: '40%' },
  { depth: 1, label: 'About', w: '32%' },
] as const;

type BootPhase = 'full' | 'quick';

function resolveBootPhase(): BootPhase {
  let seenThisSession = false;
  try {
    seenThisSession = sessionStorage.getItem(SESSION_KEY) === '1';
    sessionStorage.setItem(SESSION_KEY, '1');
  } catch {
    /* private mode */
  }

  let isReload = false;
  try {
    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    isReload = nav?.type === 'reload';
  } catch {
    /* ignore */
  }

  if (!seenThisSession || isReload) return 'full';
  return 'quick';
}

function clearBootFlag() {
  document.documentElement.removeAttribute('data-boot');
}

function unlockScroll() {
  document.documentElement.classList.remove('boot-locked');
  document.body.classList.remove('boot-locked');
  window.lenis?.start();
}

function lockScroll() {
  document.documentElement.classList.add('boot-locked');
  document.body.classList.add('boot-locked');
  window.lenis?.stop();
}

function BootProgress({
  duration,
  onComplete,
}: {
  duration: number;
  onComplete: () => void;
}) {
  const progress = useMotionValue(0);
  const width = useTransform(progress, (v) => `${v}%`);
  const [label, setLabel] = useState('0%');
  const onCompleteRef = useRef(onComplete);

  useLayoutEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useLayoutEffect(() => {
    const controls = animate(progress, 100, {
      duration,
      ease: [0.4, 0.0, 0.2, 1],
      onUpdate: (v) => {
        setLabel(`${Math.round(v)}%`);
      },
      onComplete: () => onCompleteRef.current(),
    });
    return () => controls.stop();
  }, [duration, progress]);

  return (
    <>
      <div className="boot-loader-top-progress" aria-hidden>
        <motion.div className="boot-loader-top-progress-fill" style={{ width }} />
      </div>
      <span className="boot-loader-pct" aria-hidden>
        {label}
      </span>
    </>
  );
}

export function BootLoader() {
  const bootedRef = useRef(false);
  const completedRef = useRef(false);
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [showChrome, setShowChrome] = useState(false);
  const [showFrame, setShowFrame] = useState(false);

  const finishBoot = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    window.setTimeout(() => {
      setContentVisible(false);
      window.setTimeout(() => {
        setVisible(false);
        unlockScroll();
      }, 600);
    }, 550);
  }, []);

  useLayoutEffect(() => {
    if (bootedRef.current) return;
    bootedRef.current = true;

    lockScroll();
    clearBootFlag();

    const phase = resolveBootPhase();

    if (reducedMotion) {
      const t = window.setTimeout(() => {
        setVisible(false);
        unlockScroll();
      }, 80);
      return () => window.clearTimeout(t);
    }

    if (phase === 'quick') {
      const t = window.setTimeout(() => {
        setVisible(false);
        unlockScroll();
      }, 280);
      return () => window.clearTimeout(t);
    }

    // Defer so we don't sync-setState in the effect body (cascading render lint)
    const reveal = window.setTimeout(() => setContentVisible(true), 0);
    const chromeTimer = window.setTimeout(() => setShowChrome(true), 360);
    const frameTimer = window.setTimeout(() => setShowFrame(true), 900);
    const safety = window.setTimeout(finishBoot, 6500);

    return () => {
      window.clearTimeout(reveal);
      window.clearTimeout(chromeTimer);
      window.clearTimeout(frameTimer);
      window.clearTimeout(safety);
    };
  }, [finishBoot, reducedMotion]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        clearBootFlag();
        unlockScroll();
      }}
    >
      {visible && (
        <motion.div
          key="boot-loader"
          className="boot-loader"
          role="status"
          aria-live="polite"
          aria-label="Opening portfolio file"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.8, ease: EASE_PRECISION }}
        >
          <AnimatePresence>
            {contentVisible && (
              <motion.div
                key="boot-workspace"
                className="boot-loader-workspace"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.55, ease: EASE_PRECISION }}
              >
                <BootProgress duration={4.8} onComplete={finishBoot} />

                <motion.header
                  className="boot-loader-toolbar"
                  initial={false}
                  animate={{
                    opacity: showChrome ? 1 : 0,
                    y: showChrome ? 0 : -6,
                  }}
                  transition={{ duration: MOTION.duration.fade, ease: EASE_PRECISION }}
                >
                  <div className="boot-loader-toolbar-left">
                    <span className="boot-loader-tool-cluster" aria-hidden>
                      <span />
                      <span />
                      <span />
                    </span>
                  </div>
                  <p className="boot-loader-toolbar-title">{FILE_NAME}</p>
                  <div className="boot-loader-toolbar-right">
                    <span className="boot-loader-share" aria-hidden>
                      Share
                    </span>
                  </div>
                </motion.header>

                <div className="boot-loader-body">
                  <motion.aside
                    className="boot-loader-layers"
                    initial={false}
                    animate={{
                      opacity: showChrome ? 1 : 0,
                      x: showChrome ? 0 : -12,
                    }}
                    transition={{
                      duration: MOTION.duration.reveal,
                      ease: EASE_PRECISION,
                      delay: showChrome ? 0.08 : 0,
                    }}
                  >
                    <div className="boot-loader-panel-head">
                      <span>Layers</span>
                      <span className="boot-loader-panel-page">Page 1</span>
                    </div>
                    <ul className="boot-loader-layer-list">
                      {LAYER_ROWS.map((row, i) => (
                        <motion.li
                          key={row.label}
                          className={
                            i === 0
                              ? 'boot-loader-layer boot-loader-layer--active'
                              : 'boot-loader-layer'
                          }
                          style={{ paddingLeft: `${0.65 + row.depth * 0.7}rem` }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: showChrome ? 1 : 0 }}
                          transition={{
                            delay: 0.45 + i * 0.09,
                            duration: MOTION.duration.overlay,
                          }}
                        >
                          <span className="boot-loader-layer-icon" aria-hidden />
                          <span className="boot-loader-layer-label" style={{ width: row.w }}>
                            {row.label}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.aside>

                  <div className="boot-loader-canvas">
                    <div className="boot-loader-canvas-grid" aria-hidden />

                    <AnimatePresence>
                      {showFrame && (
                        <motion.div
                          key="artboard"
                          className="boot-loader-artboard"
                          initial={
                            reducedMotion
                              ? false
                              : { opacity: 0, scale: 0.94, y: 18 }
                          }
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{
                            duration: 1.05,
                            ease: EASE_PRECISION,
                          }}
                        >
                          <span className="boot-loader-frame-tab">{FRAME_LABEL}</span>

                          <div className="boot-loader-frame">
                            <span className="boot-loader-handle boot-loader-handle--tl" />
                            <span className="boot-loader-handle boot-loader-handle--tr" />
                            <span className="boot-loader-handle boot-loader-handle--bl" />
                            <span className="boot-loader-handle boot-loader-handle--br" />

                            <div className="boot-loader-frame-inner">
                              <motion.p
                                className="boot-loader-title"
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                  delay: 0.55,
                                  duration: 0.7,
                                  ease: EASE_PRECISION,
                                }}
                              >
                                Zeina Nossier
                              </motion.p>
                              <motion.p
                                className="boot-loader-subtitle"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.9, duration: 0.55 }}
                              >
                                UI / UX & Product Designer
                              </motion.p>
                            </div>
                          </div>

                          <span className="boot-loader-dim boot-loader-dim--w">
                            {FRAME_SIZE.split(' × ')[0]}
                          </span>
                          <span className="boot-loader-dim boot-loader-dim--h">
                            {FRAME_SIZE.split(' × ')[1]}
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.aside
                    className="boot-loader-props"
                    initial={false}
                    animate={{
                      opacity: showChrome ? 1 : 0,
                      x: showChrome ? 0 : 12,
                    }}
                    transition={{
                      duration: MOTION.duration.reveal,
                      ease: EASE_PRECISION,
                      delay: showChrome ? 0.14 : 0,
                    }}
                  >
                    <div className="boot-loader-panel-head">
                      <span>Design</span>
                    </div>
                    <div className="boot-loader-prop-group">
                      <span className="boot-loader-prop-label">Frame</span>
                      <div className="boot-loader-prop-row">
                        <span>W</span>
                        <span className="boot-loader-prop-val">1440</span>
                        <span>H</span>
                        <span className="boot-loader-prop-val">900</span>
                      </div>
                    </div>
                    <div className="boot-loader-prop-group">
                      <span className="boot-loader-prop-label">Fill</span>
                      <div className="boot-loader-prop-row">
                        <span className="boot-loader-swatch" aria-hidden />
                        <span className="boot-loader-prop-val">0A0A0A</span>
                        <span className="boot-loader-prop-val">100%</span>
                      </div>
                    </div>
                    <div className="boot-loader-prop-group">
                      <span className="boot-loader-prop-label">Selection colors</span>
                      <div className="boot-loader-prop-row">
                        <span className="boot-loader-swatch boot-loader-swatch--cyan" aria-hidden />
                        <span className="boot-loader-prop-val">58BFE8</span>
                      </div>
                    </div>
                  </motion.aside>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
