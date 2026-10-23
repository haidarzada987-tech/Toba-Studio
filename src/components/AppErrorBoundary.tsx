import React, { Component, ErrorInfo, ReactNode } from 'react';
// Cache bust: 2026-04-14T09:14:00Z
import { LanguageContext } from '../context/LanguageProvider';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <LanguageContext.Consumer>
          {(langContext) => {
            const t = langContext?.t || ((key: string) => key);
            return (
              <div className="min-h-screen flex items-center justify-center bg-dark p-6 text-center">
                <div className="glass p-12 rounded-[32px] max-w-md border border-white/10">
                  <h2 className="text-3xl font-black mb-6 gradient-text">
                    {t('error_boundary_title')}
                  </h2>
                  <p className="text-gray-400 mb-8 leading-relaxed">
                    {this.state.error?.message || t('error_boundary_desc')}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="w-full bg-primary text-dark font-black py-4 rounded-2xl hover:scale-105 transition-all"
                  >
                    {t('error_boundary_retry')}
                  </button>
                </div>
              </div>
            );
          }}
        </LanguageContext.Consumer>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
