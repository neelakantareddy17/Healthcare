import './EmptyState.css';
import Icon from './Icon';

function EmptyState({ icon = 'document', title = 'Nothing here', description = '' }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon"><Icon name={icon} size={28} /></div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
    </div>
  );
}

export default EmptyState;
