'use client';

import Image from 'next/image';
import type { ServiceVisual } from '@/lib/site-content';
import { cn } from '@/lib/utils';

/** Figma 402:7335 — 12px corner nodes on the active selection within the media well */
function SelectionNodes({ className }: { className?: string }) {
  return (
    <div className={cn('service-visual-nodes', className)} aria-hidden>
      <span className="service-visual-node service-visual-node--tl" />
      <span className="service-visual-node service-visual-node--tr" />
      <span className="service-visual-node service-visual-node--bl" />
      <span className="service-visual-node service-visual-node--br" />
    </div>
  );
}

function ComponentSpecVisual() {
  return (
    <div className="service-visual-fill service-visual-fill--spec">
      <div className="service-visual-spec-layers" aria-hidden>
        <span className="service-visual-spec-layer service-visual-spec-layer--active">Button / primary</span>
        <span className="service-visual-spec-layer">Button / secondary</span>
        <span className="service-visual-spec-layer">Button / ghost</span>
      </div>
      <div className="service-visual-spec-preview">
        <div className="service-visual-spec-btn">
          <span>Get started</span>
          <SelectionNodes />
        </div>
        <span className="service-visual-spec-dim">128 × 40</span>
      </div>
    </div>
  );
}

function TypeScaleVisual() {
  return (
    <div className="service-visual-fill service-visual-fill--type">
      <div className="service-visual-type-row service-visual-type-row--display">
        <span className="service-visual-type-sample">Aa</span>
        <span className="service-visual-type-meta">48</span>
      </div>
      <div className="service-visual-type-row">
        <span className="service-visual-type-sample service-visual-type-sample--title">Title</span>
        <span className="service-visual-type-meta">24</span>
      </div>
      <div className="service-visual-type-row">
        <span className="service-visual-type-sample service-visual-type-sample--body">Body</span>
        <span className="service-visual-type-meta">16</span>
      </div>
      <span className="service-visual-type-guide" aria-hidden />
    </div>
  );
}

function ToolGridVisual({ labels }: { labels: string[] }) {
  return (
    <div className="service-visual-fill service-visual-fill--grid">
      {labels.slice(0, 4).map((label, index) => (
        <div
          key={label}
          className={cn('service-visual-chip', index === 0 && 'service-visual-chip--accent')}
        >
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

function LayoutGridVisual() {
  return (
    <div className="service-visual-fill service-visual-fill--layout">
      <div className="service-visual-layout-copy">
        <span className="service-visual-layout-bar service-visual-layout-bar--lg" aria-hidden />
        <span className="service-visual-layout-bar service-visual-layout-bar--md" aria-hidden />
        <span className="service-visual-layout-bar service-visual-layout-bar--sm" aria-hidden />
        <div className="service-visual-layout-actions" aria-hidden>
          <span className="service-visual-layout-pill" />
          <span className="service-visual-layout-pill service-visual-layout-pill--ghost" />
        </div>
        <SelectionNodes />
      </div>
      <div className="service-visual-layout-media" aria-hidden />
    </div>
  );
}

function CommerceVisual() {
  return (
    <div className="service-visual-fill service-visual-fill--commerce">
      <div className="service-visual-product-media" aria-hidden />
      <div className="service-visual-product-meta">
        <span className="service-visual-product-badge">New</span>
        <span className="service-visual-layout-bar service-visual-layout-bar--md" aria-hidden />
        <span className="service-visual-layout-bar service-visual-layout-bar--sm" aria-hidden />
        <span className="service-visual-product-price">$128</span>
      </div>
      <SelectionNodes />
    </div>
  );
}

function FlowVisual() {
  return (
    <div className="service-visual-fill service-visual-fill--flow">
      <div className="service-visual-flow-meter" aria-hidden>
        <span className="service-visual-flow-meter-fill" />
      </div>
      <ol className="service-visual-flow-steps">
        {[
          { n: '01', label: 'Cart', state: 'done' as const },
          { n: '02', label: 'Details', state: 'active' as const },
          { n: '03', label: 'Pay', state: 'pending' as const },
        ].map((step) => (
          <li
            key={step.n}
            className={cn('service-visual-flow-step', `service-visual-flow-step--${step.state}`)}
          >
            <span className="service-visual-flow-index">{step.n}</span>
            <span className="service-visual-flow-label">{step.label}</span>
            {step.state === 'active' ? <SelectionNodes /> : null}
          </li>
        ))}
      </ol>
    </div>
  );
}

function ImageVisual({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="service-visual-fill service-visual-fill--image">
      <Image src={src} alt={alt} fill className="object-cover object-top opacity-20" sizes="384px" />
      <SelectionNodes />
    </div>
  );
}

/** Figma 402:7335 empty media — translucent lattice when no typed visual is set */
function PlaceholderVisual() {
  return (
    <div className="service-visual-fill service-visual-fill--placeholder" aria-hidden>
      <span className="service-visual-placeholder-grid" />
    </div>
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
  if (visual.type === 'tool-grid') {
    return <ToolGridVisual labels={visual.labels} />;
  }
  return <PlaceholderVisual />;
}
