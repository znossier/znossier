'use client';

import Link from 'next/link';
import { Component, type ErrorInfo, type ReactNode } from 'react';

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
          className="min-h-[40vh] flex flex-col items-center justify-center gap-4 px-4 py-16 text-center bg-background text-foreground"
        >
          <h2 className="text-xl font-semibold">Something went wrong</h2>
          <p className="text-foreground/70 max-w-md">
            We couldn’t load this part of the page. Try refreshing.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-2.5 rounded-full border border-border bg-background text-foreground hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            >
              Try again
            </button>
            <button
              type="button"
              onClick={() => typeof window !== 'undefined' && window.location.reload()}
              className="px-6 py-2.5 rounded-full border border-border bg-background text-foreground hover:bg-foreground/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-link focus-visible:ring-offset-2 focus-visible:ring-offset-background transition-colors"
            >
              Reload page
            </button>
          </div>
          <Link href="/" className="text-link hover:underline text-sm">
            Back to home
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
