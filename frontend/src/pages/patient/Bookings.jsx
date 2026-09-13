import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import AppointmentCard from '../../components/appointment/AppointmentCard';
import PatientAvatar from '../../components/patient/PatientAvatar';
import { usePatientAvatar } from '../../utils/avatar.jsx';
import { getPatientAppointments, cancelAppointment } from '../../services/appointment';
import './Bookings.css';

const statusFilters = ['All', 'Upcoming', 'Completed'];
const ALL_MONTHS = 'All Months';
const upcomingStatuses = ['PENDING', 'PAID'];

const getMonthLabel = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
};

function Bookings() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const avatarId = usePatientAvatar(user?.id);
  const [appointments, setAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('All');
  const [monthFilter, setMonthFilter] = useState(ALL_MONTHS);
  const [loading, setLoading] = useState(true);

  const isToday = (dateStr) => {
    const apptDate = new Date(dateStr);
    const today = new Date();
    return (
      apptDate.getFullYear() === today.getFullYear() &&
      apptDate.getMonth() === today.getMonth() &&
      apptDate.getDate() === today.getDate()
    );
  };

  useEffect(() => {
    const loadAppointments = async () => {
      const appts = await getPatientAppointments(user?.id || 1);
      setAppointments(appts);
      setLoading(false);
    };

    loadAppointments();
  }, [user]);

  const monthOptions = useMemo(() => {
    const months = Array.from(
      new Set(appointments.map((appt) => getMonthLabel(appt.date)))
    );

    months.sort((a, b) => new Date(`1 ${b}`) - new Date(`1 ${a}`));
    return [ALL_MONTHS, ...months];
  }, [appointments]);

  const filteredAppointments = appointments.filter((appointment) => {
    const statusMatch = statusFilter === 'All'
      || (statusFilter === 'Upcoming' && upcomingStatuses.includes(appointment.status))
      || (statusFilter === 'Completed' && appointment.status === 'COMPLETED');
    const monthMatch = monthFilter === ALL_MONTHS || getMonthLabel(appointment.date) === monthFilter;
    return statusMatch && monthMatch;
  });

  const upcomingCount = appointments.filter((appointment) => upcomingStatuses.includes(appointment.status)).length;
  const completedCount = appointments.filter((appointment) => appointment.status === 'COMPLETED').length;

  const handleCancel = async (id) => {
    const updated = await cancelAppointment(id);
    setAppointments((prev) => prev.map((appointment) => (
      appointment.id === id ? { ...appointment, ...updated } : appointment
    )));
  };

  return (
    <PatientLayout>
      <div className="bookings-page">
        <div className="bookings-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <PatientAvatar avatarId={avatarId} name={user?.name} size={48} showRing />
            <div>
              <h2 className="page-title" style={{ margin: 0 }}>My Bookings</h2>
              <p className="page-subtitle" style={{ margin: '2px 0 0 0' }}>Track upcoming appointments and review completed visits.</p>
            </div>
          </div>

          <div className="booking-stats-grid">
            <div className="booking-stat-card">
              <span className="booking-stat-label">Upcoming</span>
              <strong>{upcomingCount}</strong>
            </div>
            <div className="booking-stat-card">
              <span className="booking-stat-label">Completed</span>
              <strong>{completedCount}</strong>
            </div>
          </div>
        </div>

        <section className="bookings-filters">
          <div className="filters-header">
            <div>
              <p className="filter-heading">Filter bookings</p>
              <p className="filter-subtitle">Use status and month filters to narrow your appointment list.</p>
            </div>
            <div className="filter-count">{filteredAppointments.length} bookings</div>
          </div>

          <div className="bookings-filter-group">
            <div className="filter-block">
              <span className="filter-block__heading">Status</span>
              <div className="filter-pill-group">
                {statusFilters.map((status) => (
                  <button
                    key={status}
                    type="button"
                    className={`filter-pill ${statusFilter === status ? 'filter-pill--active' : ''}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-block">
              <span className="filter-block__heading">Month</span>
              <label className="filter-select">
                <span className="filter-select__icon">📅</span>
                <select
                  value={monthFilter}
                  onChange={(event) => setMonthFilter(event.target.value)}
                  aria-label="Filter by month"
                >
                  {monthOptions.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>

        {loading ? (
          <Loader />
        ) : filteredAppointments.length === 0 ? (
          <EmptyState
            icon="📅"
            title="No bookings found"
            description="Try changing your filters or book a new appointment."
          />
        ) : (
          <div className="bookings-list">
            {filteredAppointments.map((appointment) => {
              const showCheckIn = appointment.status === 'PAID' && isToday(appointment.date);
              return (
                <AppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  onCancel={upcomingStatuses.includes(appointment.status) ? handleCancel : undefined}
                  onCheckIn={showCheckIn ? () => navigate('/patient/checkin', { state: { appointment } }) : undefined}
                />
              );
            })}
          </div>
        )}
      </div>
    </PatientLayout>
  );
}

export default Bookings;
