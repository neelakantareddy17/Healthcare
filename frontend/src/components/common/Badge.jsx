import './Badge.css';

function Badge({ label, type = 'default' }) {
  return <span className={`badge badge--${type}`}>{label}</span>;
}

export default Badge;
