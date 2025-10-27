import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so next render shows fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    console.error("🧩 Error caught by ErrorBoundary:", error, info);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          height: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#121212",
          color: "white"
        }}>
          <h1>⚠️ Oops! Something went wrong.</h1>
          <p>{this.state.error?.message || "Unexpected error occurred."}</p>
          <button
            style={{
              marginTop: "20px",
              padding: "10px 20px",
              borderRadius: "8px",
              background: "#ff5555",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
            onClick={this.handleReload}
          >
            Reload App
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
