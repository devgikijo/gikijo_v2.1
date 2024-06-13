function EmptyData({ icon = null, title = '', description = '' }) {
  return (
    <div class="text-muted d-flex flex-column justify-content-center align-items-center h-100">
      {icon ? icon : <i class="bi bi-exclamation-circle"></i>}
      <h6 class="my-1">{title}</h6>
      <small class="text-muted">{description}</small>
    </div>
  );
}
// d-flex h-100 justify-content-center align-items-center
export default EmptyData;
