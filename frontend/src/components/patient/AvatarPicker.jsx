/**
 * AvatarPicker — grid of 8 avatar choices with selection highlight.
 *
 * Props:
 *   value     string | null  – currently selected avatarId
 *   onChange  (id) => void   – called with new avatarId (or null to clear)
 */
import { AVATARS } from '../../utils/avatar.jsx';
import './AvatarPicker.css';

function AvatarPicker({ value, onChange }) {
  return (
    <div className="avp-wrap" role="group" aria-label="Choose your avatar">
      <div className="avp-grid">
        {AVATARS.map((av) => {
          const selected = value === av.id;
          return (
            <button
              key={av.id}
              type="button"
              className={`avp-item ${selected ? 'avp-item--selected' : ''}`}
              aria-label={`Avatar: ${av.label}${selected ? ' (selected)' : ''}`}
              aria-pressed={selected}
              onClick={() => onChange(selected ? null : av.id)}
            >
              {av.svg(52)}
              {selected && (
                <span className="avp-check" aria-hidden="true">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="12" fill="#0d6e64" />
                    <path d="M6 12.5l4 4 8-8" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
            </button>
          );
        })}
      </div>
      {value && (
        <button type="button" className="avp-clear" onClick={() => onChange(null)}>
          Remove selection
        </button>
      )}
    </div>
  );
}

export default AvatarPicker;
