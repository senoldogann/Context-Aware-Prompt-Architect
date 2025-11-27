import React, { Component, ErrorInfo, ReactNode } from 'react';

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
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-8">
          <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-8 max-w-md">
            <h2 className="text-xl font-semibold text-slate-200 mb-4">
              Something went wrong
            </h2>
            <p className="text-sm text-slate-400 mb-6">
              An unexpected error occurred. Please try refreshing the application.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-700 text-slate-100 rounded-md hover:bg-slate-600 transition-colors"
            >
              Reload Application
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

