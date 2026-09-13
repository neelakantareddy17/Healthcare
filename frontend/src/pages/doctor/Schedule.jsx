import { useEffect, useState } from 'react';
import DoctorLayout from '../../layouts/DoctorLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { getDoctorAppointments } from '../../services/appointment';
import { createDoctorLeave, deleteDoctorLeave, getDoctorLeaves } from '../../services/doctorLeave';
import { getLocalDateInputValue } from '../../utils/date';
import './Schedule.css';

const formatDate = (value) => new Date(`${value}T00:00:00`).toLocaleDateString(undefined, {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

const formatLeaveDate = (value) => new Date(value).toLocaleDateString();

function Schedule() {
  const [selectedDate, setSelectedDate] = useState(getLocalDateInputValue());
  const [appointments, setAppointments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [success, setSuccess] = useState('');
  const [savingLeave, setSavingLeave] = useState(false);
  const [deletingLeave, setDeletingLeave] = useState('');
  const [leaveForm, setLeaveForm] = useState({ startDate: selectedDate, endDate: selectedDate, reason: '' });

  const loadSchedule = async () => {
    setLoading(true);
    setError('');
    try {
      const [nextAppointments, nextLeaves] = await Promise.all([
        getDoctorAppointments(undefined, { date: selectedDate, limit: 100 }),
        getDoctorLeaves(),
      ]);
      setAppointments(nextAppointments);
      setLeaves(nextLeaves);
    } catch (loadError) {
      setError(loadError.response?.data?.message || 'Unable to load your schedule.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadSchedule(); }, [selectedDate]);

  const handleLeaveSubmit = async (event) => {
    event.preventDefault();
    setSavingLeave(true);
    setActionError('');
    setSuccess('');
    try {
      await createDoctorLeave(leaveForm);
      setSuccess('Leave added to your schedule.');
      setLeaveForm({ startDate: selectedDate, endDate: selectedDate, reason: '' });
      await loadSchedule();
    } catch (submitError) {
      setActionError(submitError.response?.data?.message || 'Unable to add leave.');
    } finally {
      setSavingLeave(false);
    }
  };

  const handleDeleteLeave = async (leaveId) => {
    setDeletingLeave(leaveId);
    setActionError('');
    setSuccess('');
    try {
      await deleteDoctorLeave(leaveId);
      setLeaves((current) => current.filter((leave) => leave.id !== leaveId));
      setSuccess('Leave removed from your schedule.');
    } catch (deleteError) {
      setActionError(deleteError.response?.data?.message || 'Unable to remove leave.');
    } finally {
      setDeletingLeave('');
    }
  };

  return (
    <DoctorLayout>
      <div className="schedule-heading">
        <div><h2>My Schedule</h2><p>Appointments and approved leave from your account</p></div>
        <label className="schedule-date-label" htmlFor="schedule-date">Date
          <input id="schedule-date" type="date" value={selectedDate} onChange={(event) => setSelectedDate(event.target.value)} />
        </label>
      </div>

      {success && <div className="schedule-message schedule-message--success">{success}</div>}
      {actionError && <div className="schedule-message schedule-message--error">{actionError}</div>}
      {loading ? <Loader /> : error ? (
        <div className="schedule-message schedule-message--error">{error} <button type="button" onClick={loadSchedule}>Retry</button></div>
      ) : (
        <>
          <section className="schedule-section">
            <h3>{formatDate(selectedDate)}</h3>
            {appointments.length === 0 ? <EmptyState icon="calendar" title="No appointments scheduled" /> : (
              <div className="schedule-appointments">
                {appointments.map((appointment) => (
                  <div className="schedule-appointment" key={appointment.id}>
                    <div className="schedule-appointment__time">{appointment.time}</div>
                    <div className="schedule-appointment__details"><strong>{appointment.patientName}</strong><span>Symptoms: {appointment.symptoms || 'Not provided'}</span></div>
                    <span className={`schedule-status schedule-status--${appointment.status.toLowerCase()}`}>{appointment.statusLabel}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="schedule-section">
            <h3>Manage Leave</h3>
            <form className="leave-form" onSubmit={handleLeaveSubmit}>
              <label>Start date<input type="date" value={leaveForm.startDate} onChange={(event) => setLeaveForm({ ...leaveForm, startDate: event.target.value })} required /></label>
              <label>End date<input type="date" value={leaveForm.endDate} onChange={(event) => setLeaveForm({ ...leaveForm, endDate: event.target.value })} required /></label>
              <label className="leave-form__reason">Reason (optional)<input type="text" value={leaveForm.reason} onChange={(event) => setLeaveForm({ ...leaveForm, reason: event.target.value })} /></label>
              <Button type="submit" title={savingLeave ? 'Adding...' : 'Add Leave'} disabled={savingLeave} />
            </form>
            {leaves.length === 0 ? <p className="schedule-muted">No leave recorded.</p> : leaves.map((leave) => (
              <div className="leave-item" key={leave.id}>
                <div><strong>{formatLeaveDate(leave.startDate)} - {formatLeaveDate(leave.endDate)}</strong><span>{leave.reason || 'No reason provided'}</span></div>
                <button type="button" onClick={() => handleDeleteLeave(leave.id)} disabled={deletingLeave === leave.id}>{deletingLeave === leave.id ? 'Removing...' : 'Remove'}</button>
              </div>
            ))}
          </section>
        </>
      )}
    </DoctorLayout>
  );
}

export default Schedule;
