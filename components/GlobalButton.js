const GlobalButton = ({
  btnTitle = 'Button',
  btnOnClick,
  btnType = 'button',
  btnClass = 'btn btn-primary',
  btnLoading = false,
  btnHideLoading = false,
  children,
}) => {
  return (
    <button
      type={btnType}
      class={btnClass}
      onClick={btnOnClick}
      disabled={btnLoading}
    >
      {btnLoading && !btnHideLoading ? (
        <span
          class="spinner-border spinner-border-sm me-2"
          role="status"
          aria-hidden="true"
        ></span>
      ) : null}
      {children || btnTitle}
    </button>
  );
};

export default GlobalButton;
