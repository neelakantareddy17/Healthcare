import Badge from '../common/Badge';
import { formatDate, formatTime } from '../../utils/formatDate';
import './AppointmentCard.css';

function AppointmentCard({ appointment, onCancel }) {
  const statusTypeMap = {
    Upcoming: 'primary',
    Completed: 'success',
    Cancelled: 'danger',
  };

  return (
    <div className="appt-card">
      <div className="appt-card__header">
        <div>
          <h3 className="appt-card__doctor">{appointment.doctorName}</h3>
          <p className="appt-card__specialty">{appointment.specialty}</p>
        </div>
        <Badge label={appointment.status} type={statusTypeMap[appointment.status] || 'default'} />
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
        <div className="appt-card__info-item">
          <span>🎫</span>
          <span>Token #{appointment.tokenNumber}</span>
        </div>
        <div className="appt-card__info-item">
          <span>💰</span>
          <span>₹{appointment.fee}</span>
        </div>
      </div>
      {appointment.status === 'Upcoming' && onCancel && (
        <button className="appt-card__cancel" onClick={() => onCancel(appointment.id)}>
          Cancel Appointment
        </button>
      )}
    </div>
  );
}

export default AppointmentCard;
