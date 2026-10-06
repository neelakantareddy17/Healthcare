import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Icon from '../../components/common/Icon';
import { getPatients } from '../../services/patient';
import { getInitials } from '../../utils/helpers';
import './Patients.css';

const getAccountIsActive = (patient) => patient.user?.isActive !== false;

const getAge = (dob) => {
  if (!dob) return null;
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const beforeBirthday = today.getMonth() < birthDate.getMonth()
    || (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());
  if (beforeBirthday) age -= 1;
  if (age < 0) return null;

  return age === 0 ? 'Under 1 year' : `${age} ${age === 1 ? 'year' : 'years'}`;
};

function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    getPatients()
      .then(setPatients)
      .catch((requestError) => setError(requestError.response?.data?.message || 'Patient information could not be loaded.'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedPatient) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setSelectedPatient(null);
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedPatient]);

  const filteredPatients = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();
    if (!searchTerm) return patients;

    return patients.filter((patient) => [
      patient.name,
      patient.email,
      patient.phone,
      patient.gender,
      patient.bloodGroup,
    ].some((value) => String(value || '').toLowerCase().includes(searchTerm)));
  }, [patients, query]);

  const formatGender = (gender) => gender
    ? `${gender[0].toUpperCase()}${gender.slice(1).toLowerCase()}`
    : '';

  return (
    <AdminLayout>
      <section className="admin-page admin-patients">
        <div className="admin-page-header">
          <div>
            <h2 className="admin-page-title">Patients</h2>
            <p className="admin-page-subtitle">View registered patient information.</p>
          </div>
          {!loading && !error && (
            <span className="admin-patients__count">
              {patients.length} {patients.length === 1 ? 'Patient' : 'Patients'}
            </span>
          )}
        </div>

        {!loading && !error && patients.length > 0 && (
          <label className="admin-patients__search">
            <Icon name="search" size={18} />
            <input
              type="text"
              role="searchbox"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search patients..."
              aria-label="Search patients"
            />
            {query && (
              <button type="button" onClick={() => setQuery('')} aria-label="Clear search">
                <Icon name="close" size={16} />
              </button>
            )}
          </label>
        )}

        {loading ? <Loader /> : error ? (
          <div className="admin-feedback" role="alert">{error}</div>
        ) : patients.length === 0 ? (
          <EmptyState
            icon="users"
            title="No Patients Yet"
            description="Registered patients will appear here once they create an account."
          />
        ) : filteredPatients.length ? (
          <div className="admin-patient-list">
            {filteredPatients.map((patient) => {
              const isActive = getAccountIsActive(patient);
              const details = [
                formatGender(patient.gender),
                patient.bloodGroup,
                getAge(patient.dob),
              ].filter(Boolean);

              return (
                <button
                  type="button"
                  className="admin-patient-card admin-card"
                  key={patient.id}
                  onClick={() => setSelectedPatient(patient)}
                  aria-label={`View details for ${patient.name}`}
                >
                  <span className="admin-patient-card__avatar">{getInitials(patient.name)}</span>
                  <span className="admin-patient-card__identity">
                    <span className="admin-patient-card__name">{patient.name}</span>
                    <span className="admin-patient-card__subline">{details.join(' · ') || 'Patient details'}</span>
                  </span>
                  <span className="admin-patient-card__email">{patient.email || patient.phone || 'Contact details unavailable'}</span>
                  <span className={`admin-patient-status${isActive ? ' admin-patient-status--active' : ' admin-patient-status--inactive'}`}>
                    <span />
                    {isActive ? 'Active' : 'Inactive'}
                  </span>
                  <Icon name="chevronRight" size={18} className="admin-patient-card__chevron" />
                </button>
              );
            })}
          </div>
        ) : (
          <EmptyState
            icon="search"
            title="No matching patients"
            description="Try another name, email, phone number, or patient detail."
          />
        )}
      </section>

      {selectedPatient && (
        <div
          className="admin-patient-drawer__backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedPatient(null);
          }}
        >
          <aside
            className="admin-patient-drawer"
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-patient-drawer-title"
          >
            <header className="admin-patient-drawer__header">
              <h2 id="admin-patient-drawer-title">Patient Details</h2>
              <button type="button" onClick={() => setSelectedPatient(null)} aria-label="Close patient details">
                <Icon name="close" size={19} />
              </button>
            </header>

            <div className="admin-patient-drawer__body">
              <div className="admin-patient-drawer__profile">
                <span className="admin-patient-drawer__avatar">{getInitials(selectedPatient.name)}</span>
                <h3>{selectedPatient.name}</h3>
                <span className={`admin-patient-status${getAccountIsActive(selectedPatient) ? ' admin-patient-status--active' : ' admin-patient-status--inactive'}`}>
                  <span />
                  {getAccountIsActive(selectedPatient) ? 'Active' : 'Inactive'}
                </span>
              </div>

              {(selectedPatient.email || selectedPatient.phone) && (
                <section className="admin-patient-drawer__section">
                  <h4>Contact</h4>
                  {selectedPatient.email && <div className="admin-patient-drawer__field"><span>Email</span><strong>{selectedPatient.email}</strong></div>}
                  {selectedPatient.phone && <div className="admin-patient-drawer__field"><span>Phone</span><strong>{selectedPatient.phone}</strong></div>}
                </section>
              )}

              {(selectedPatient.gender || selectedPatient.dob || selectedPatient.bloodGroup) && (
                <section className="admin-patient-drawer__section">
                  <h4>Personal</h4>
                  {selectedPatient.gender && <div className="admin-patient-drawer__field"><span>Gender</span><strong>{formatGender(selectedPatient.gender)}</strong></div>}
                  {getAge(selectedPatient.dob) && <div className="admin-patient-drawer__field"><span>Age</span><strong>{getAge(selectedPatient.dob)}</strong></div>}
                  {selectedPatient.bloodGroup && <div className="admin-patient-drawer__field"><span>Blood group</span><strong>{selectedPatient.bloodGroup}</strong></div>}
                </section>
              )}

              <section className="admin-patient-drawer__section">
                <h4>Account</h4>
                <div className="admin-patient-drawer__field">
                  <span>Status</span>
                  <strong>{getAccountIsActive(selectedPatient) ? 'Active' : 'Inactive'}</strong>
                </div>
              </section>
            </div>

            <footer className="admin-patient-drawer__footer">
              <button type="button" onClick={() => setSelectedPatient(null)}>Close</button>
            </footer>
          </aside>
        </div>
      )}
    </AdminLayout>
  );
}

export default Patients;
