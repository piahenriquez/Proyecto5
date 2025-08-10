import { Component } from "react";


export class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      errorMessage: "" 
    };
  }

  static getDerivedStateFromError(error) {
    return { 
      hasError: true, 
      errorMessage: error.message || "Error desconocido" 
    };
  }
  

  handleRetry = () => {
    this.setState({ hasError: false });
    window.location.reload(); 
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>¡Algo salió mal!</h2>
          <p>{this.state.errorMessage}</p>
          <button onClick={this.handleRetry}>Reintentar</button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;

