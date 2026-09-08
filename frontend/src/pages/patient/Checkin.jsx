import { useLocation, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import './BookingSuccess.css';

function Checkin() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appt = state?.appointment;
  const qrSrc = appt?.qrCode
    ? appt.qrCode.startsWith('data:image')
      ? appt.qrCode
      : `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(appt.qrCode)}`
    : '';
  const hasImageQr = typeof appt?.qrCode === 'string' && appt.qrCode.startsWith('data:image');

  if (!appt) {
    return (
      <PatientLayout>
        <div className="success-container">
          <h2 className="success-title">No appointment selected</h2>
          <p className="success-subtitle">Please open the check-in action from your upcoming appointment card.</p>
          <Button title="Back to Home" onClick={() => navigate('/patient')} />
        </div>
      </PatientLayout>
    );
  }

  return (
    <PatientLayout>
      <div className="success-container">
        <div className="success-qr success-qr--large">
          <div className="qr-code qr-code--large">
            {qrSrc ? (
              <img className="qr-image" src={qrSrc} alt="Appointment QR code" />
            ) : (
              <div className="qr-pattern">
                {Array.from({ length: 49 }).map((_, i) => (
                  <div key={i} className={`qr-cell ${Math.random() > 0.5 ? 'qr-cell--dark' : ''}`} />
                ))}
              </div>
            )}
          </div>
          <p className="qr-hint">Present this QR at the clinic for fast check-in.</p>
        </div>

        <div className="success-details success-details--compact">
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
        </div>

        <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <Button title="Go to Home" variant="secondary" onClick={() => navigate('/patient')} />
        </div>
      </div>
    </PatientLayout>
  );
}

export default Checkin;
