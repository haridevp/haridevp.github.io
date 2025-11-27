import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', backgroundColor: '#1a1a1a', color: '#ff5555', height: '100vh', fontFamily: 'monospace' }}>
          <h1>System Malfunction</h1>
          <p>Critical error detected in the neural uplink.</p>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '1rem' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button 
            onClick={() => window.location.reload()}
            style={{ marginTop: '2rem', padding: '1rem', background: '#333', color: 'white', border: '1px solid #555', cursor: 'pointer' }}
          >
            Attempt System Reboot
          </button>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
