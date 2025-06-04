import React, { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null, errorInfo: null };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log the error to an error reporting service
        console.error('Error caught by boundary:', error, errorInfo);
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
    }

    render() {
        if (this.state.hasError) {
            // You can render any custom fallback UI
            return (
                <div className="container mt-5">
                    <div className="card shadow border-left-danger">
                        <div className="card-body">
                            <h2 className="text-danger">Something went wrong</h2>
                            <p>We're sorry, but there was an error in the application.</p>
                            <div className="my-3">
                                <button
                                    className="btn btn-primary"
                                    onClick={() => window.location.reload()}
                                >
                                    Reload Page
                                </button>
                                <button
                                    className="btn btn-outline-secondary ml-2"
                                    onClick={() => {
                                        localStorage.clear();
                                        window.location.href = '/login';
                                    }}
                                >
                                    Logout
                                </button>
                            </div>
                            {process.env.NODE_ENV === 'development' && (
                                <details className="mt-4" style={{ whiteSpace: 'pre-wrap' }}>
                                    <summary className="text-danger font-weight-bold">Error Details (Development Mode Only)</summary>
                                    <div className="mt-3">
                                        <div className="text-danger">{this.state.error?.toString()}</div>
                                        <div className="mt-2 text-muted small">
                                            {this.state.errorInfo?.componentStack}
                                        </div>
                                    </div>
                                </details>
                            )}
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
