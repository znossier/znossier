'use client';

import Image from 'next/image';
import type { ReactNode } from 'react';
import type { ServiceVisual } from '@/lib/site-content';
import { cn } from '@/lib/utils';

function ArtifactChrome({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('service-artifact flex h-full min-h-[8rem] flex-col md:min-h-0', className)}>
      <div className="service-artifact-tab type-meta" aria-hidden>
        {label}
      </div>
      <div className="service-artifact-stage relative min-h-0 flex-1">{children}</div>
    </div>
  );
}

function SelectionBox({ className, children }: { className?: string; children?: React.ReactNode }) {
  return (
    <div className={cn('service-artifact-selection', className)}>
      <span className="service-artifact-handle service-artifact-handle--tl" aria-hidden />
      <span className="service-artifact-handle service-artifact-handle--tr" aria-hidden />
      <span className="service-artifact-handle service-artifact-handle--bl" aria-hidden />
      <span className="service-artifact-handle service-artifact-handle--br" aria-hidden />
      {children}
    </div>
  );
}

function ComponentSpecVisual() {
  return (
    <ArtifactChrome label="Components / Primary">
      <div className="service-artifact-body service-artifact-body--stack">
        <div className="service-artifact-layers" aria-hidden>
          <div className="service-artifact-layer service-artifact-layer--active">
            <span className="service-artifact-layer-dot" />
            Button / primary
          </div>
          <div className="service-artifact-layer">
            <span className="service-artifact-layer-dot" />
            Button / secondary
          </div>
          <div className="service-artifact-layer">
            <span className="service-artifact-layer-dot" />
            Button / ghost
          </div>
        </div>
        <div className="service-artifact-spec-preview">
          <SelectionBox className="service-artifact-spec-selection">
            <span className="service-artifact-btn-primary type-meta">Get started</span>
          </SelectionBox>
          <span className="service-artifact-dim type-meta" aria-hidden>
            128 × 40
          </span>
        </div>
      </div>
    </ArtifactChrome>
  );
}

function TypeScaleVisual() {
  return (
    <ArtifactChrome label="Type / Scale">
      <div className="service-artifact-body service-artifact-body--center">
        <div className="service-artifact-type-row service-artifact-type-row--display">
          <span className="service-artifact-type-sample">Aa</span>
          <span className="service-artifact-type-meta type-meta">48</span>
        </div>
        <div className="service-artifact-type-row">
          <span className="service-artifact-type-sample service-artifact-type-sample--title">Title</span>
          <span className="service-artifact-type-meta type-meta">24</span>
        </div>
        <div className="service-artifact-type-row">
          <span className="service-artifact-type-sample service-artifact-type-sample--body">Body</span>
          <span className="service-artifact-type-meta type-meta">16</span>
        </div>
        <div className="service-artifact-type-guide" aria-hidden />
      </div>
    </ArtifactChrome>
  );
}

function ToolGridVisual({ labels }: { labels: string[] }) {
  return (
    <ArtifactChrome label="Stack / Tools">
      <div className="service-artifact-body service-artifact-body--grid">
        {labels.map((label, index) => (
          <div
            key={label}
            className={cn(
              'service-artifact-chip flex items-center justify-center',
              index === 0 && 'service-artifact-chip--accent'
            )}
          >
            <span className="type-meta text-center leading-tight">{label}</span>
          </div>
        ))}
      </div>
    </ArtifactChrome>
  );
}

function LayoutGridVisual() {
  return (
    <ArtifactChrome label="Layout / Hero">
      <div className="service-artifact-body service-artifact-body--fill">
        <div className="service-artifact-layout-grid">
          <SelectionBox className="service-artifact-layout-copy">
            <div className="service-artifact-layout-copy-body">
              <span className="service-artifact-layout-headline" aria-hidden />
              <span className="service-artifact-layout-subline" aria-hidden />
              <span className="service-artifact-layout-line" aria-hidden />
              <span className="service-artifact-layout-line service-artifact-layout-line--short" aria-hidden />
            </div>
            <div className="service-artifact-layout-actions" aria-hidden>
              <span className="service-artifact-layout-btn" />
              <span className="service-artifact-layout-btn service-artifact-layout-btn--ghost" />
              <span className="service-artifact-layout-btn service-artifact-layout-btn--icon" />
            </div>
          </SelectionBox>

          <div className="service-artifact-layout-portrait service-artifact-block service-artifact-block--accent" aria-hidden />

          <span className="service-artifact-layout-hint type-meta" aria-hidden>
            Scroll
          </span>
        </div>
      </div>
    </ArtifactChrome>
  );
}

function CommerceVisual() {
  return (
    <ArtifactChrome label="Product / Card">
      <div className="service-artifact-body service-artifact-body--fill">
        <div className="service-artifact-product">
          <div className="service-artifact-product-media" aria-hidden />
          <div className="service-artifact-product-body">
            <span className="service-artifact-product-badge type-meta">New</span>
            <span className="service-artifact-product-line service-artifact-product-line--title" aria-hidden />
            <span className="service-artifact-product-line" aria-hidden />
            <span className="service-artifact-product-price type-meta">$128</span>
          </div>
          <SelectionBox className="service-artifact-product-selection" />
        </div>
      </div>
    </ArtifactChrome>
  );
}

function FlowVisual() {
  return (
    <ArtifactChrome label="Flow / Checkout">
      <div className="service-artifact-body service-artifact-body--stack">
        <div className="service-artifact-flow-meter" aria-hidden>
          <span className="service-artifact-flow-meter-track" />
          <span className="service-artifact-flow-meter-fill" />
        </div>

        <ol className="service-artifact-flow-steps">
          <li className="service-artifact-flow-item service-artifact-flow-item--done">
            <div className="service-artifact-flow-rail" aria-hidden>
              <span className="service-artifact-flow-node service-artifact-flow-node--done">
                <span className="service-artifact-flow-check" />
              </span>
              <span className="service-artifact-flow-connector service-artifact-flow-connector--done" />
            </div>
            <div className="service-artifact-flow-card service-artifact-flow-card--done">
              <div className="service-artifact-flow-card-head">
                <span className="service-artifact-flow-index type-meta">01</span>
                <span className="service-artifact-flow-label type-meta">Cart</span>
              </div>
              <span className="service-artifact-flow-hint type-meta">2 items · $256</span>
            </div>
          </li>

          <li className="service-artifact-flow-item service-artifact-flow-item--active">
            <div className="service-artifact-flow-rail" aria-hidden>
              <span className="service-artifact-flow-node service-artifact-flow-node--active" />
              <span className="service-artifact-flow-connector" />
            </div>
            <SelectionBox className="service-artifact-flow-card service-artifact-flow-card--active">
              <div className="service-artifact-flow-card-head">
                <span className="service-artifact-flow-index type-meta">02</span>
                <span className="service-artifact-flow-label type-meta">Details</span>
              </div>
              <div className="service-artifact-flow-fields" aria-hidden>
                <span className="service-artifact-flow-field" />
                <span className="service-artifact-flow-field service-artifact-flow-field--short" />
              </div>
              <span className="service-artifact-flow-hint type-meta">Shipping &amp; contact</span>
            </SelectionBox>
          </li>

          <li className="service-artifact-flow-item service-artifact-flow-item--pending">
            <div className="service-artifact-flow-rail" aria-hidden>
              <span className="service-artifact-flow-node service-artifact-flow-node--pending" />
            </div>
            <div className="service-artifact-flow-card service-artifact-flow-card--pending">
              <div className="service-artifact-flow-card-head">
                <span className="service-artifact-flow-index type-meta">03</span>
                <span className="service-artifact-flow-label type-meta">Pay</span>
              </div>
              <span className="service-artifact-flow-hint type-meta">Card · Apple Pay</span>
            </div>
          </li>
        </ol>
      </div>
    </ArtifactChrome>
  );
}

function ImageVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <ArtifactChrome label="Preview">
      <div className="service-artifact-body service-artifact-body--fill service-artifact-body--flush">
        <div className="service-artifact-image-frame relative min-h-[8rem] flex-1 md:min-h-0">
          <Image src={src} alt={alt} fill className="service-artifact-image object-cover object-top" sizes="(max-width: 768px) 100vw, 176px" />
          <div className="service-artifact-image-scrim pointer-events-none absolute inset-0" aria-hidden />
          <SelectionBox className="service-artifact-image-selection" />
        </div>
      </div>
    </ArtifactChrome>
  );
}

export function getDefaultServiceVisual(index: number): ServiceVisual {
  const rotation: ServiceVisual[] = [
    { type: 'flow' },
    { type: 'component-spec' },
    { type: 'commerce' },
    { type: 'layout-grid' },
  ];
  return rotation[index % rotation.length];
}

export function ServiceVisualArtifact({ visual }: { visual: ServiceVisual }) {
  if (visual.type === 'image') {
    return <ImageVisual src={visual.src} alt={visual.alt} />;
  }
  if (visual.type === 'component-spec') {
    return <ComponentSpecVisual />;
  }
  if (visual.type === 'type-scale') {
    return <TypeScaleVisual />;
  }
  if (visual.type === 'layout-grid') {
    return <LayoutGridVisual />;
  }
  if (visual.type === 'commerce') {
    return <CommerceVisual />;
  }
  if (visual.type === 'flow') {
    return <FlowVisual />;
  }
  return <ToolGridVisual labels={visual.labels} />;
}
