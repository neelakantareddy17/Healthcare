import { useLocation, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import './BookingSuccess.css';

function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appt = state?.appointment;

  if (!appt) return <PatientLayout><p>Appointment data not found.</p></PatientLayout>;

  return (
    <PatientLayout>
      <div className="success-container">
        <div className="success-icon">✅</div>
        <h2 className="success-title">Appointment Booked!</h2>
        <p className="success-subtitle">Your appointment has been confirmed successfully.</p>

        <div className="success-qr">
          <div className="qr-code">
            <div className="qr-pattern">
              {Array.from({ length: 49 }).map((_, i) => (
                <div key={i} className={`qr-cell ${Math.random() > 0.5 ? 'qr-cell--dark' : ''}`} />
              ))}
            </div>
          </div>
          <p className="qr-code-text">{appt.qrCode}</p>
          <p className="qr-hint">Show this QR at the clinic for check-in</p>
        </div>

        <div className="success-details">
          <div className="success-detail-item">
            <span>🩺 Doctor</span>
            <strong>{appt.doctorName}</strong>
          </div>
          <div className="success-detail-item">
            <span>📅 Date</span>
            <strong>{appt.date}</strong>
          </div>
          <div className="success-detail-item">
            <span>🕐 Time</span>
            <strong>{appt.time}</strong>
          </div>
          <div className="success-detail-item">
            <span>🎫 Token</span>
            <strong>#{appt.tokenNumber}</strong>
          </div>
          <div className="success-detail-item">
            <span>💰 Fee</span>
            <strong>₹{appt.fee}</strong>
          </div>
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button title="View Queue Status" onClick={() => navigate('/patient/queue')} />
          <Button title="Go to Home" variant="secondary" onClick={() => navigate('/patient')} />
        </div>
      </div>
    </PatientLayout>
  );
}

export default BookingSuccess;
