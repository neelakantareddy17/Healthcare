import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import './FullQueue.css';

export const SYNTHETIC_QUEUE = {
  currentToken: 'A-42',
  myToken: 'A-48',
  patientsAhead: 5,
  estimatedWait: '14 mins',
  queueLabel: 'OPD-03',
  doctor: {
    name: 'Dr. Sarah Jenkins',
    specialty: 'Senior Cardiologist',
    photo: '',
    rating: 4.9,
    reviewCount: 120,
    room: '102-B',
    building: 'Wing A',
    floor: '2nd',
    department: 'Department of Cardiology',
    avgConsultTime: '8-10 mins',
  },
  entries: [
    {
      id: 1,
      token: 'A-42',
      patientName: 'Robert K.',
      status: 'in-progress',
      note: 'Started 4 mins ago · ECG Review',
      expectedTime: '10:35 AM',
      type: 'Consultation',
      isMe: false,
    },
    {
      id: 2,
      token: 'A-43',
      patientName: 'Maria S.',
      status: 'up-next',
      note: 'Vitals recorded · Calling next',
      expectedTime: '10:45 AM',
      type: 'Follow-up',
      isMe: false,
    },
    {
      id: 3,
      token: 'A-44',
      patientName: 'David L.',
      status: 'upcoming',
      note: 'Checked in · Waiting in Lobby',
      expectedTime: '10:55 AM',
      type: 'Routine Checkup',
      isMe: false,
    },
    {
      id: 4,
      token: 'A-45',
      patientName: 'Pooja R.',
      status: 'upcoming',
      note: 'Lab results pending review',
      expectedTime: '11:05 AM',
      type: 'Lab Review',
      isMe: false,
    },
    {
      id: 5,
      token: 'A-46',
      patientName: 'Thomas H.',
      status: 'upcoming',
      note: 'Checked in at desk',
      expectedTime: '11:15 AM',
      type: 'Consultation',
      isMe: false,
    },
    {
      id: 6,
      token: 'A-47',
      patientName: 'Anita B.',
      status: 'upcoming',
      note: 'Waiting in Waiting Area',
      expectedTime: '11:25 AM',
      type: 'BP & Heart Rate Check',
      isMe: false,
    },
    {
      id: 7,
      token: 'A-48',
      patientName: 'Alex Johnson (You)',
      status: 'upcoming',
      note: 'Your Appointment · Est: ~14 mins',
      expectedTime: '11:35 AM',
      type: 'Cardiology Consultation',
      isMe: true,
    },
    {
      id: 8,
      token: 'A-49',
      patientName: 'Vikram S.',
      status: 'upcoming',
      note: 'Checked in via App',
      expectedTime: '11:45 AM',
      type: 'Follow-up',
      isMe: false,
    },
    {
      id: 9,
      token: 'A-50',
      patientName: 'Grace M.',
      status: 'upcoming',
      note: 'Registered for Consultation',
      expectedTime: '11:55 AM',
      type: 'Second Opinion',
      isMe: false,
    },
    {
      id: 10,
      token: 'A-51',
      patientName: 'Rajesh K.',
      status: 'upcoming',
      note: 'Registered at Kiosk',
      expectedTime: '12:05 PM',
      type: 'Prescription Renewal',
      isMe: false,
    },
  ],
};

function FullQueue() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [notified, setNotified] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const data = SYNTHETIC_QUEUE;
  const { doctor, entries } = data;

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  };

  const filteredEntries = entries.filter((e) => {
    const matchesFilter =
      filter === 'all'
        ? true
        : filter === 'in-progress'
        ? e.status === 'in-progress'
        : filter === 'waiting'
        ? e.status !== 'in-progress'
        : filter === 'me'
        ? e.isMe
        : true;

    const matchesSearch =
      e.token.toLowerCase().includes(search.toLowerCase()) ||
      e.patientName.toLowerCase().includes(search.toLowerCase()) ||
      e.type.toLowerCase().includes(search.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <PatientLayout>
      {/* Navigation & Header */}
      <div className="fq-top-bar">
        <button className="fq-back-btn" onClick={() => navigate('/patient/queue')}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M19 12H5M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back
        </button>
        <button className={`fq-refresh-btn ${refreshing ? 'fq-refreshing' : ''}`} onClick={handleRefresh} title="Refresh Queue">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>{refreshing ? 'Refreshing...' : 'Live'}</span>
        </button>
      </div>

      <div className="fq-header">
        <p className="fq-eyebrow">Live Queue Tracker</p>
        <h2 className="fq-title">Full Queue List ({entries.length})</h2>
        <p className="fq-doctor-subtitle">
          {doctor.name} · {doctor.specialty} · Room {doctor.room} ({doctor.building})
        </p>
      </div>

      {/* Your Queue Position Banner */}
      <div className="fq-my-banner">
        <div className="fq-my-banner-left">
          <div className="fq-my-token-badge">{data.myToken}</div>
          <div>
            <p className="fq-my-label">Your Token Position</p>
            <p className="fq-my-ahead">
              <strong>{data.patientsAhead} patients ahead</strong> · Est. wait <strong>{data.estimatedWait}</strong>
            </p>
          </div>
        </div>
        <button
          className={`fq-notify-btn ${notified ? 'fq-notify-btn--active' : ''}`}
          onClick={() => setNotified(!notified)}
        >
          {notified ? '🔔 Alert Set' : '🔔 Alert Me'}
        </button>
      </div>

      {/* Search Input */}
      <div className="fq-search-wrap">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="fq-search-icon">
          <circle cx="11" cy="11" r="8" stroke="currentColor" strokeWidth="2" />
          <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          className="fq-search-input"
          placeholder="Search by token (e.g. A-48), name or type..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        {search && (
          <button className="fq-search-clear" onClick={() => setSearch('')}>
            ✕
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="fq-filter-tabs">
        <button
          className={`fq-tab ${filter === 'all' ? 'fq-tab--active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({entries.length})
        </button>
        <button
          className={`fq-tab ${filter === 'in-progress' ? 'fq-tab--active' : ''}`}
          onClick={() => setFilter('in-progress')}
        >
          Serving (1)
        </button>
        <button
          className={`fq-tab ${filter === 'waiting' ? 'fq-tab--active' : ''}`}
          onClick={() => setFilter('waiting')}
        >
          Waiting ({entries.length - 1})
        </button>
        <button
          className={`fq-tab ${filter === 'me' ? 'fq-tab--active' : ''}`}
          onClick={() => setFilter('me')}
        >
          My Token ({data.myToken})
        </button>
      </div>

      {/* Queue List */}
      <div className="fq-list">
        {filteredEntries.map((item, index) => {
          const isCurrent = item.status === 'in-progress';
          const isUpNext = item.status === 'up-next';

          return (
            <div
              key={item.id}
              className={`fq-item ${isCurrent ? 'fq-item--current' : ''} ${item.isMe ? 'fq-item--me' : ''}`}
            >
              <div className="fq-item-left">
                <span className="fq-item-index">#{index + 1}</span>
                <div
                  className={`fq-token-chip ${
                    isCurrent
                      ? 'fq-token-chip--current'
                      : item.isMe
                      ? 'fq-token-chip--me'
                      : isUpNext
                      ? 'fq-token-chip--upnext'
                      : ''
                  }`}
                >
                  {item.token}
                </div>
              </div>

              <div className="fq-item-body">
                <div className="fq-item-header">
                  <span className="fq-patient-name">{item.patientName}</span>
                  {item.isMe && <span className="fq-badge-me">You</span>}
                  {isCurrent && <span className="fq-badge-current">● In Consultation</span>}
                  {isUpNext && <span className="fq-badge-upnext">Up Next</span>}
                </div>
                <p className="fq-item-note">{item.note}</p>
                <div className="fq-item-meta">
                  <span className="fq-meta-type">{item.type}</span>
                  <span className="fq-meta-time">🕒 {item.expectedTime}</span>
                </div>
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="fq-empty">
            <p>No queue items found matching &ldquo;{search}&rdquo;</p>
          </div>
        )}
      </div>

      <div className="fq-footer-actions">
        <Link to="/patient/queue" className="fq-btn-back-link">
          ← Return to Live Token Orbit
        </Link>
      </div>
    </PatientLayout>
  );
}

export default FullQueue;
