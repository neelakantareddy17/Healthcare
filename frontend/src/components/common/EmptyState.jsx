import './EmptyState.css';

function EmptyState({ icon = '📭', title = 'Nothing here', description = '' }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon">{icon}</div>
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__desc">{description}</p>}
    </div>
  );
}

export default EmptyState;
