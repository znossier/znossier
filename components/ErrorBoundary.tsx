'use client';

import Link from 'next/link';
import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/Button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    if (process.env.NODE_ENV === 'development') {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div
          role="alert"
          className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-16 text-center bg-canvas text-primary"
        >
          <h2 className="type-heading text-lg">Something went wrong</h2>
          <p className="type-body max-w-md">We couldn’t load this part of the page. Try refreshing.</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              onClick={() => this.setState({ hasError: false, error: null })}
              variant="secondary"
              className="min-h-10 px-5"
            >
              Try again
            </Button>
            <Button
              onClick={() => typeof window !== 'undefined' && window.location.reload()}
              variant="secondary"
              className="min-h-10 px-5"
            >
              Reload page
            </Button>
          </div>
          <Link href="/" className="type-meta text-link hover:underline">
            Back to home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
