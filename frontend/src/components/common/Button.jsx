import './Button.css';

function Button({ title, onClick, variant = 'primary', type = 'button', disabled = false, style = {} }) {
  return (
    <button
      type={type}
      className={`btn btn--${variant}`}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      {title}
    </button>
  );
}

export default Button;
