import './Input.css';

function Input({ label, placeholder, type = 'text', value, onChange, name, required = false, icon }) {
  return (
    <div className="input-wrapper">
      {label && <label className="input-label">{label}</label>}
      <div className="input-field-wrap">
        {icon && <span className="input-icon">{icon}</span>}
        <input
          className={`input-field ${icon ? 'input-field--icon' : ''}`}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          name={name}
          required={required}
        />
      </div>
    </div>
  );
}

export default Input;
