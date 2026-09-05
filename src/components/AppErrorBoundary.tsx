import { Component, type ErrorInfo, type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

type State = {
  hasError: boolean;
};

export class AppErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Keep the fallback UI visible in production if a route crashes.
  }

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
          <div className="glass-panel w-full rounded-[2rem] border border-white/60 p-8 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)]">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary/70">
              Something Went Wrong
            </p>
            <h1 className="mt-4 text-3xl font-bold text-foreground">
              EXAMTREE hit an unexpected error
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Refresh the page to continue. If the problem repeats, go back to the
              dashboard and try again.
            </p>
            <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center rounded-2xl border border-primary bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={() => {
                  window.location.href = "/";
                }}
                className="inline-flex items-center justify-center rounded-2xl border border-border bg-card px-5 py-3 text-sm font-semibold text-foreground"
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
