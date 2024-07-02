function LoadingSpinner({ isLoading = false, isSmall = false }) {
  if (isLoading) {
    if (isSmall) {
      return (
        <div
          class="spinner-border spinner-border-sm text-primary"
          role="status"
        >
          <span class="visually-hidden">Loading...</span>
        </div>
      );
    }
    return (
      <div className="d-flex h-100 justify-content-center align-items-center p-5">
        <div className="spinner-border" role="status"></div>
      </div>
    );
  }
}

export default LoadingSpinner;
