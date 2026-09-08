import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import { getPatientQueue } from '../../services/queue';
import { SYNTHETIC_QUEUE } from './FullQueue';
import './QueueStatus.css';

const FALLBACK = SYNTHETIC_QUEUE;

function QueueStatus() {
  const { user } = useAuth();
  const { queueId } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAllInline, setShowAllInline] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const q = await getPatientQueue(user?.id || 1, queueId);
        const looksValid = q && !Array.isArray(q) && Array.isArray(q.entries) && q.doctor;
        setData(looksValid ? q : SYNTHETIC_QUEUE);
      } catch {
        setData(SYNTHETIC_QUEUE);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, queueId]);

  if (loading) {
    return (
      <PatientLayout>
        <Loader />
      </PatientLayout>
    );
  }

  const q = data || FALLBACK;
  const { doctor, entries } = q;
  const current = entries.find((e) => e.status === 'in-progress') || entries[0];
  const nextUp = entries.find((e) => e.status !== 'in-progress');
  const remainingCount = Math.max(entries.length - (current ? 1 : 0) - (nextUp ? 1 : 0), 0);

  const statusLabel = { 'in-progress': 'In Progress', 'up-next': 'Up Next', upcoming: 'Upcoming' };

  return (
    <PatientLayout>
      <p className="qs-eyebrow">Live Status</p>
      <h2 className="qs-title">Now Serving</h2>

      <div className="qs-token-orbit">
        <div className="qs-token-card">
          <p className="qs-token-number">{q.currentToken}</p>
          <p className="qs-token-label">{q.queueLabel}</p>
        </div>
      </div>

      <div className="qs-stat-row">
        <div className="qs-stat-card">
          <p className="qs-stat-head">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M7 15h4M7 11h.01" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" /></svg>
            Your Token
          </p>
          <p className="qs-stat-value">{q.myToken}</p>
          <span className="qs-pill qs-pill--lavender">Est: {q.estimatedWait}</span>
        </div>

        <div className="qs-stat-card">
          <p className="qs-stat-head">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><circle cx="9" cy="8" r="3" stroke="currentColor" strokeWidth="1.6" /><path d="M3 19c1-3 3.5-4.6 6-4.6s5 1.6 6 4.6M16 8a3 3 0 100 6M18 19c-.5-2-1.6-3.4-3-4.2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
            Ahead
          </p>
          <p className="qs-stat-value">{String(q.patientsAhead).padStart(2, '0')} <span className="qs-stat-unit">patients</span></p>
          <span className="qs-pill qs-pill--mint">Moving Fast</span>
        </div>
      </div>

      <div className="qs-doctor-card">
        <div className="qs-doctor-head">
          {doctor.photo ? (
            <img src={doctor.photo} alt={doctor.name} className="qs-doctor-photo" />
          ) : (
            <div className="qs-doctor-photo qs-doctor-photo--placeholder" />
          )}
          <div>
            <h3 className="qs-doctor-name">{doctor.name}</h3>
            <p className="qs-doctor-specialty">{doctor.specialty}</p>
            <p className="qs-doctor-rating">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" /></svg>
              {doctor.rating} ({doctor.reviewCount}+ reviews)
            </p>
          </div>
        </div>
        <div className="qs-doctor-grid">
          <div>
            <p className="qs-doctor-grid__label">Room No.</p>
            <p className="qs-doctor-grid__value">{doctor.room}</p>
          </div>
          <div>
            <p className="qs-doctor-grid__label">Building</p>
            <p className="qs-doctor-grid__value">{doctor.building}</p>
          </div>
          <div>
            <p className="qs-doctor-grid__label">Floor</p>
            <p className="qs-doctor-grid__value">{doctor.floor}</p>
          </div>
        </div>
      </div>

      <div className="qs-list-head">
        <h3 className="section-title">Live Queue List</h3>
        <span className="qs-updated">Updated Just Now</span>
      </div>

      {current && (
        <div className={`qs-queue-item qs-queue-item--current ${current.isMe ? 'qs-queue-item--me' : ''}`}>
          <div className="qs-queue-token qs-queue-token--current">{current.token}</div>
          <div className="qs-queue-body">
            <div className="qs-queue-header-row">
              <p className="qs-queue-status">{statusLabel[current.status] || current.status}</p>
              {current.isMe && <span className="qs-tag-me">You</span>}
            </div>
            <p className="qs-queue-note">{current.patientName ? `${current.patientName} · ` : ''}{current.note}</p>
          </div>
          <span className="qs-queue-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="14" height="16" rx="1.5" stroke="currentColor" strokeWidth="1.5" /><path d="M17.5 15.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z" stroke="currentColor" strokeWidth="1.3" /></svg>
          </span>
        </div>
      )}

      {nextUp && (
        <div className={`qs-queue-item ${nextUp.isMe ? 'qs-queue-item--me' : ''}`}>
          <div className={`qs-queue-token ${nextUp.isMe ? 'qs-queue-token--me' : ''}`}>{nextUp.token}</div>
          <div className="qs-queue-body">
            <div className="qs-queue-header-row">
              <p className="qs-queue-status">{statusLabel[nextUp.status] || nextUp.status}</p>
              {nextUp.isMe && <span className="qs-tag-me">You</span>}
            </div>
            <p className="qs-queue-note">{nextUp.patientName ? `${nextUp.patientName} · ` : ''}{nextUp.note}</p>
          </div>
          <span className="qs-queue-waiting">Waiting</span>
        </div>
      )}

      {showAllInline &&
        entries
          .filter((e) => e.token !== current?.token && e.token !== nextUp?.token)
          .map((entry) => (
            <div
              key={entry.token}
              className={`qs-queue-item ${entry.isMe ? 'qs-queue-item--me' : ''}`}
            >
              <div className={`qs-queue-token ${entry.isMe ? 'qs-queue-token--me' : ''}`}>
                {entry.token}
              </div>
              <div className="qs-queue-body">
                <div className="qs-queue-header-row">
                  <p className="qs-queue-status">
                    {statusLabel[entry.status] || 'Upcoming'}
                  </p>
                  {entry.isMe && <span className="qs-tag-me">You</span>}
                </div>
                <p className="qs-queue-note">
                  {entry.patientName ? `${entry.patientName} · ` : ''}
                  {entry.note}
                </p>
              </div>
              <span className="qs-queue-waiting">
                {entry.isMe ? '⭐ Your Turn' : 'Waiting'}
              </span>
            </div>
          ))}

      <div className="qs-actions-group">
        <Link to="/patient/queue/full" className="qs-view-more">
          View Full Queue ({entries.length} Tokens) →
        </Link>
        {remainingCount > 0 && (
          <button
            type="button"
            className="qs-toggle-btn"
            onClick={() => setShowAllInline(!showAllInline)}
          >
            {showAllInline ? '▲ Collapse Inline List' : `▼ Expand Inline (${remainingCount} More)`}
          </button>
        )}
      </div>
    </PatientLayout>
  );
}

export default QueueStatus;