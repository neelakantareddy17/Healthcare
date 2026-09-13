/**
 * PatientAvatar — reusable avatar component.
 *
 * Props:
 *   avatarId   string | null  – one of 'av1'…'av8', or null
 *   name       string         – patient display name (for initials fallback)
 *   size       number         – diameter in px (default 48)
 *   className  string         – extra class(es) on the outer element
 *   onClick    function       – optional click handler
 *   showRing   bool           – draw a teal ring (e.g. for profile header)
 */
import { getAvatarById, getInitials, getInitialsColor } from '../../utils/avatar.jsx';
import './PatientAvatar.css';

function PatientAvatar({
  avatarId = null,
  name = '',
  size = 48,
  className = '',
  onClick,
  showRing = false,
}) {
  const avatar = avatarId ? getAvatarById(avatarId) : null;
  const Tag    = onClick ? 'button' : 'div';

  const wrapStyle = {
    width:  size,
    height: size,
    minWidth: size,
    borderRadius: '50%',
  };

  const ringClass = showRing ? 'pa-ring' : '';

  return (
    <Tag
      className={`pa-wrap ${ringClass} ${className}`}
      style={wrapStyle}
      onClick={onClick}
      type={onClick ? 'button' : undefined}
      aria-label={avatar ? avatar.label : `${name || 'Patient'} initials avatar`}
    >
      {avatar ? (
        // Inline SVG avatar — never a broken image
        <span className="pa-svg" aria-hidden="true">
          {avatar.svg(size)}
        </span>
      ) : (
        // Initials fallback
        <InitialsBubble name={name} size={size} />
      )}
    </Tag>
  );
}

export function InitialsBubble({ name, size }) {
  const initials = getInitials(name);
  const { bg, fg } = getInitialsColor(name);
  const fontSize   = Math.round(size * 0.35);

  return (
    <span
      className="pa-initials"
      style={{ background: bg, color: fg, fontSize, borderRadius: '50%', width: '100%', height: '100%' }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export default PatientAvatar;
