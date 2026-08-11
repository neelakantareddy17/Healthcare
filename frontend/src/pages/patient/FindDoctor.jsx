import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
// TODO: confirm these exports exist in services/doctor.js — adjust names if yours differ
import { getDoctors } from '../../services/doctor';
import './FindDoctor.css';

const specialties = [
  { key: 'Cardiology', label: 'Cardiology', variant: 'rose', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0112 5.5 5.5 5.5 0 0121.5 11c-2.5 4.6-9.5 9-9.5 9z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M4 12h3l2-3 2 5 2-4 1.5 2H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
  ) },
  { key: 'Dermatology', label: 'Dermatology', variant: 'teal', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 21c-4 0-6.5-3-6.5-6.5C5.5 10 12 3 12 3s6.5 7 6.5 11.5C18.5 18 16 21 12 21z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9.5 15.5c0 1.4 1.1 2.5 2.5 2.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
  ) },
  { key: 'Neurology', label: 'Neurology', variant: 'blue', icon: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M9 4a3 3 0 013 3v10a3 3 0 01-6 0V9a3 3 0 013-3zM15 4a3 3 0 00-3 3v10a3 3 0 006 0V9a3 3 0 00-3-3z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" /></svg>
  ) },
];

function FindDoctor() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getDoctors();
        setDoctors(data);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = query
    ? doctors.filter((d) =>
        `${d.name} ${d.specialty}`.toLowerCase().includes(query.toLowerCase())
      )
    : doctors;

  return (
    <PatientLayout>
      <div className="fd-search-row">
        <div className="fd-search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="fd-search__icon">
            <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
            <path d="M21 21l-4.3-4.3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            placeholder="Search specialist, clinic, or doctor"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="fd-search__input"
          />
        </div>
        <button type="button" className="fd-filter-btn" aria-label="Filters">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M4 6h16M7 12h10M10 18h4" stroke="white" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="fd-recommendation">
        <span className="fd-recommendation__icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 3l1.8 5.6L19 10l-5.2 1.4L12 17l-1.8-5.6L5 10l5.2-1.4L12 3z" fill="currentColor" /></svg>
        </span>
        <div>
          <p className="fd-recommendation__title">MediQ Recommendation</p>
          <p className="fd-recommendation__text">
            Based on your recent heart rate data, you might want to consult a Cardiologist.
          </p>
        </div>
      </div>

      <div className="fd-section-head">
        <h3 className="section-title">Specialists</h3>
        <button type="button" className="fd-viewall" onClick={() => setQuery('')}>View All</button>
      </div>
      <div className="fd-specialties">
        {specialties.map((s) => (
          <button
            key={s.key}
            type="button"
            className="fd-specialty"
            onClick={() => setQuery(s.key)}
          >
            <span className={`fd-specialty__icon fd-specialty__icon--${s.variant}`}>{s.icon}</span>
            <span className="fd-specialty__label">{s.label}</span>
          </button>
        ))}
      </div>

      <h3 className="section-title">Recommended for You</h3>
      {loading ? (
        <Loader />
      ) : filtered.length === 0 ? (
        <div className="fd-empty">No doctors match "{query}".</div>
      ) : (
        <div className="fd-doctor-list">
          {filtered.map((doc) => (
            <div key={doc.id} className="fd-doctor-card">
              <div className="fd-doctor-photo-wrap">
                <img src={doc.photo} alt={doc.name} className="fd-doctor-photo" />
                <span className="fd-doctor-rating">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 16.9l-6.1 3.5 1.5-6.8L2.2 9l6.9-.7L12 2z" /></svg>
                  {doc.rating}
                </span>
              </div>

              <div className="fd-doctor-body">
                <h4 className="fd-doctor-name">{doc.name}</h4>
                <p className="fd-doctor-specialty">{doc.specialty}</p>
                {doc.badge && (
                  <p className="fd-doctor-meta">
                    <span className={`fd-badge fd-badge--${doc.badgeVariant || 'default'}`}>{doc.badge}</span>
                    <span className="fd-doctor-exp">• {doc.experienceYears} yrs exp.</span>
                  </p>
                )}
                <div className="fd-doctor-foot">
                  <div>
                    <p className="fd-fee-label">Fee</p>
                    <p className="fd-fee-value">${doc.fee}</p>
                  </div>
                  <button
                    type="button"
                    className="fd-book-btn"
                    onClick={() => navigate(`/patient/book/${doc.id}`)}
                  >
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </PatientLayout>
  );
}

export default FindDoctor;