import { Component, ReactNode } from "react";
import { AlertCircle } from "lucide-react";

interface Props {
  children?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
          <h1 className="text-2xl font-bold text-navy mb-2">Oops, something went wrong!</h1>
          <p className="text-navy/70 max-w-md mb-6">
            We're sorry, but an unexpected error occurred while loading this page.
          </p>
          <button 
            onClick={() => window.location.href = "/"}
            className="bg-navy text-white px-6 py-2 rounded font-bold shadow-md hover:bg-navy-light transition-colors"
          >
            Return to Home
          </button>
          
          {process.env.NODE_ENV === "development" && (
            <div className="mt-10 p-4 bg-red-50 border border-red-200 rounded text-left overflow-auto max-w-full text-xs text-red-800">
              <strong>Error Details (Dev Only):</strong>
              <pre className="mt-2">{this.state.error?.toString()}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
