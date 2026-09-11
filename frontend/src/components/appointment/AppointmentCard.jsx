import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatDate';
import './AppointmentCard.css';

function AppointmentCard({ appointment, onCancel, onCheckIn, onComplete }) {
  const statusTypeMap = {
    PENDING: 'primary',
    PAID: 'primary',
    CHECKED_IN: 'primary',
    IN_PROGRESS: 'primary',
    COMPLETED: 'success',
    CANCELLED: 'danger',
  };

  return (
    <div className="appt-card">
      <div className="appt-card__header">
        <div>
          <h3 className="appt-card__doctor">{appointment.doctorName}</h3>
          <p className="appt-card__specialty">{appointment.specialty}</p>
        </div>
        <Badge label={appointment.statusLabel || appointment.status} type={statusTypeMap[appointment.status] || 'default'} />
      </div>
      <div className="appt-card__info">
        <div className="appt-card__info-item">
          <span>📅</span>
          <span>{formatDate(appointment.date)}</span>
        </div>
        <div className="appt-card__info-item">
          <span>🕐</span>
          <span>{appointment.time}</span>
        </div>
      </div>

      {(onCheckIn || onComplete || (appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && onCancel)) && (
        <div className="appt-card__actions">
          {onCheckIn && (
            <button className="appt-card__checkin" onClick={onCheckIn}>
              Check-in
            </button>
          )}
          {appointment.status !== 'COMPLETED' && appointment.status !== 'CANCELLED' && onCancel && (
            <button className="appt-card__cancel" onClick={() => onCancel(appointment.id)}>
              Cancel Appointment
            </button>
          )}
          {onComplete && (
            <button className="appt-card__checkin" onClick={onComplete}>
              Complete Treatment
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default AppointmentCard;
