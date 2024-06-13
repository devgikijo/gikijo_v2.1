function EmptyMessage() {
  return (
    <div id="content-list-empty">
      <div className="container mt-3">
        <div className="row justify-content-center align-items-center">
          <p class="text-muted">
            <i class="bi bi-exclamation-circle me-1"></i> Sorry, we couldn't
            find any results.
          </p>
        </div>
      </div>
    </div>
  );
}

export default EmptyMessage;
