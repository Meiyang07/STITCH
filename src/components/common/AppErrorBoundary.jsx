import React from 'react';

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown startup error' };
  }

  componentDidCatch(error, info) {
    console.error('Application error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main style={{ minHeight: '100vh', padding: '48px 24px', background: '#F5F2EC', color: '#111111', fontFamily: 'Arial, sans-serif' }}>
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ letterSpacing: '.18em', fontSize: 12 }}>STITCH</p>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 48, margin: '24px 0 12px' }}>The website could not finish loading.</h1>
            <p style={{ lineHeight: 1.7 }}>A browser-side error occurred. The exact message is shown below so it can be fixed instead of leaving a blank screen.</p>
            <pre style={{ marginTop: 24, padding: 18, overflow: 'auto', background: '#111111', color: '#ffffff', whiteSpace: 'pre-wrap' }}>{this.state.message}</pre>
            <button onClick={() => window.location.reload()} style={{ marginTop: 24, border: '1px solid #111111', background: 'transparent', padding: '12px 18px', cursor: 'pointer' }}>Reload website</button>
          </div>
        </main>
      );
    }
    return this.props.children;
  }
}
