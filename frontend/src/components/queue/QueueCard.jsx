import './QueueCard.css';
import Icon from '../common/Icon';

function QueueCard({ queue, onComplete }) {
  const waiting = Math.max(queue.tokenNumber - (queue.currentToken || 0), 0);

  return (
    <div className="queue-card">
      <div className="queue-card__left">
        <p className="queue-card__doctor">{queue.patientName || queue.doctorName}</p>
        <p className="queue-card__specialty">{queue.specialty}</p>
        <p className="queue-card__symptoms">Symptoms: {queue.symptoms || 'Not provided'}</p>
        <p className="queue-card__status">{queue.status}</p>
        <p className="queue-card__wait"><Icon name="clock" size={15} /> Est. wait: {queue.estimatedWait}</p>
        {queue.status === 'IN_PROGRESS' && onComplete && (
          <button type="button" onClick={onComplete}>Complete Treatment</button>
        )}
      </div>
      <div className="queue-card__right">
        <div className="queue-card__your-token">
          <p className="queue-card__token-label">Your Token</p>
          <p className="queue-card__token">#{queue.tokenNumber}</p>
        </div>
        <div className="queue-card__current">
          <p className="queue-card__token-label">Now Serving</p>
          <p className="queue-card__current-num">#{queue.currentToken}</p>
        </div>
        <p className="queue-card__ahead">{waiting} ahead</p>
      </div>
    </div>
  );
}

export default QueueCard;
