import { useNavigate } from 'react-router-dom';
import Badge from '../common/Badge';
import { getInitials } from '../../utils/helpers';
import './DoctorCard.css';

function DoctorCard({ doctor }) {
  const navigate = useNavigate();
  const statusType = doctor.available ? 'success' : 'danger';
  const statusLabel = doctor.available ? 'Available' : 'Unavailable';

  return (
    <div className="doctor-card" onClick={() => navigate(`/patient/doctor/${doctor.id}`)}>
      <div className="doctor-card__avatar">
        {doctor.avatar ? (
          <img src={doctor.avatar} alt={doctor.name} />
        ) : (
          <span>{getInitials(doctor.name)}</span>
        )}
      </div>
      <div className="doctor-card__info">
        <div className="doctor-card__top">
          <h3 className="doctor-card__name">{doctor.name}</h3>
          <Badge label={statusLabel} type={statusType} />
        </div>
        <p className="doctor-card__specialty">{doctor.specialty}</p>
        <p className="doctor-card__hospital">🏥 {doctor.hospital}, {doctor.city}</p>
        <div className="doctor-card__meta">
          <span>⭐ {doctor.rating} ({doctor.reviews})</span>
          <span>💼 {doctor.experience}yrs</span>
          <span className="doctor-card__fee">₹{doctor.fee}</span>
        </div>
      </div>
    </div>
  );
}

export default DoctorCard;
