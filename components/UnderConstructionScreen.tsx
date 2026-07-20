'use client';

import { Mail, Linkedin } from 'lucide-react';
import { Button } from '@/components/Button';
import { mockContact } from '@/lib/mock-data';

const FILE_NAME = 'Zeina Nossier — Portfolio';
const FRAME_LABEL = 'Home';
const LINKEDIN = mockContact.socialLinks.find((l) => l.platform === 'LinkedIn')?.url;

const LAYER_ROWS = [
  { depth: 0, label: 'Home', w: '42%' },
  { depth: 1, label: 'Hero', w: '34%' },
  { depth: 1, label: 'Works', w: '38%' },
  { depth: 2, label: 'Card / 01', w: '48%' },
  { depth: 2, label: 'Card / 02', w: '44%' },
  { depth: 1, label: 'Expertise', w: '40%' },
  { depth: 1, label: 'About', w: '32%' },
] as const;

export function UnderConstructionScreen() {
  return (
    <main
      id="main-content"
      className="boot-loader construction-screen"
      role="main"
      aria-label="Portfolio under construction"
    >
      <div className="boot-loader-workspace">
        <header className="boot-loader-toolbar">
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
        </header>

        <div className="boot-loader-body">
          <aside className="boot-loader-layers" aria-hidden>
            <div className="boot-loader-panel-head">
              <span>Layers</span>
              <span className="boot-loader-panel-page">Page 1</span>
            </div>
            <ul className="boot-loader-layer-list">
              {LAYER_ROWS.map((row, i) => (
                <li
                  key={row.label}
                  className={
                    i === 0
                      ? 'boot-loader-layer boot-loader-layer--active'
                      : 'boot-loader-layer'
                  }
                  style={{ paddingLeft: `${0.65 + row.depth * 0.7}rem` }}
                >
                  <span className="boot-loader-layer-icon" />
                  <span className="boot-loader-layer-label" style={{ width: row.w }}>
                    {row.label}
                  </span>
                </li>
              ))}
            </ul>
          </aside>

          <div className="boot-loader-canvas">
            <div className="boot-loader-canvas-grid" aria-hidden />

            <div className="boot-loader-artboard">
              <span className="boot-loader-frame-tab">{FRAME_LABEL}</span>

              <div className="boot-loader-frame">
                <span className="boot-loader-handle boot-loader-handle--tl" aria-hidden />
                <span className="boot-loader-handle boot-loader-handle--tr" aria-hidden />
                <span className="boot-loader-handle boot-loader-handle--bl" aria-hidden />
                <span className="boot-loader-handle boot-loader-handle--br" aria-hidden />

                <div className="boot-loader-frame-inner construction-screen-inner">
                  <p className="boot-loader-title">Zeina Nossier</p>
                  <p className="boot-loader-subtitle">Portfolio under construction</p>

                  <div className="construction-screen-actions">
                    <Button href={`mailto:${mockContact.email}`} variant="accent">
                      <Mail className="h-4 w-4 shrink-0" aria-hidden />
                      Email Zeina
                    </Button>
                    {LINKEDIN && (
                      <Button
                        href={LINKEDIN}
                        variant="secondary"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Zeina Nossier on LinkedIn"
                      >
                        <Linkedin className="h-4 w-4 shrink-0" aria-hidden />
                        LinkedIn
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <span className="boot-loader-dim boot-loader-dim--w" aria-hidden>
                1440
              </span>
              <span className="boot-loader-dim boot-loader-dim--h" aria-hidden>
                900
              </span>
            </div>
          </div>

          <aside className="boot-loader-props" aria-hidden>
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
                <span className="boot-loader-swatch" />
                <span className="boot-loader-prop-val">0A0A0A</span>
                <span className="boot-loader-prop-val">100%</span>
              </div>
            </div>
            <div className="boot-loader-prop-group">
              <span className="boot-loader-prop-label">Selection colors</span>
              <div className="boot-loader-prop-row">
                <span className="boot-loader-swatch boot-loader-swatch--cyan" />
                <span className="boot-loader-prop-val">58BFE8</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
