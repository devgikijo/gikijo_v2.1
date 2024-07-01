function LoadingSpinner({ isLoading = false }) {
  if (isLoading) {
    return (
      <div className="d-flex h-100 justify-content-center align-items-center p-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }
}

export default LoadingSpinner;
