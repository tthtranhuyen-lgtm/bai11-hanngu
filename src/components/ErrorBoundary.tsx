import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-pink-50 via-purple-50 to-teal-50">
          <div className="bg-white/95 backdrop-blur-md rounded-3xl p-8 max-w-lg w-full text-center shadow-xl border border-purple-100">
            <div className="w-16 h-16 rounded-2xl bg-pink-100 text-pink-600 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 font-rounded">
              Đã có lỗi xảy ra
            </h2>
            <p className="text-sm text-gray-600 mb-6">
              Ứng dụng gặp sự cố khi hiển thị nội dung. Bạn có thể nhấn nút bên dưới để tải lại trang.
            </p>
            {this.state.error?.message && (
              <div className="text-left text-xs bg-gray-50 text-gray-700 p-3 rounded-xl border border-gray-200 mb-6 overflow-x-auto font-mono">
                {this.state.error.message}
              </div>
            )}
            <button
              onClick={this.handleReload}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold text-sm shadow-md hover:scale-105 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Tải lại trang</span>
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
