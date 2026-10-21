import React from 'react';
import { AlertOctagon, RotateCcw } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Lỗi giao diện (ErrorBoundary caught):', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center p-6 bg-slate-950 text-slate-100 border border-red-500/30 rounded-xl">
          <AlertOctagon className="w-10 h-10 text-rose-500 mb-3 animate-pulse" />
          <h3 className="text-base font-bold font-mono text-rose-400 mb-2">
            Đã xảy ra lỗi khi render component
          </h3>
          <p className="text-xs text-slate-400 font-mono mb-4 text-center max-w-md bg-slate-900 p-2.5 rounded border border-slate-800">
            {this.state.error?.message || 'Lỗi không xác định'}
          </p>
          <button
            type="button"
            onClick={() => this.setState({ hasError: false, error: null })}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-mono text-cyan-400 border border-slate-700"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Thử tải lại
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
