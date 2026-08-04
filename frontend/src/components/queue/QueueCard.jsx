import './QueueCard.css';

function QueueCard({ queue }) {
  const waiting = queue.tokenNumber - queue.currentToken;

  return (
    <div className="queue-card">
      <div className="queue-card__left">
        <p className="queue-card__doctor">{queue.doctorName}</p>
        <p className="queue-card__specialty">{queue.specialty}</p>
        <p className="queue-card__status">{queue.status}</p>
        <p className="queue-card__wait">⏱ Est. wait: {queue.estimatedWait}</p>
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
