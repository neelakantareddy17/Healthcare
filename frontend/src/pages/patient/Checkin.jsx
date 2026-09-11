import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import { checkIn } from '../../services/queue';
import { getStoredPayment } from '../../services/payment';
import './BookingSuccess.css';

function Checkin() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appt = state?.appointment;
  const payment = getStoredPayment(appt?.id);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [error, setError] = useState('');
  const qrSrc = payment?.qrCode || appt?.qrCode || '';
  const checkInCode = payment?.checkInCode || appt?.checkInCode;

  const handleCheckIn = async () => {
    setCheckingIn(true);
    setError('');
    try {
      await checkIn(checkInCode);
      setCheckedIn(true);
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Check-in could not be completed.');
    } finally {
      setCheckingIn(false);
    }
  };

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
              <p className="qr-hint">Payment QR is unavailable for this appointment.</p>
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
          {checkedIn ? (
            <p role="status">Checked in successfully. Your queue entry is now active.</p>
          ) : (
            <Button title={checkingIn ? 'Checking in...' : 'Confirm Check-in'} onClick={handleCheckIn} disabled={checkingIn || !checkInCode} />
          )}
          {error && <p role="alert">{error}</p>}
          <Button title="Go to Home" variant="secondary" onClick={() => navigate('/patient')} />
        </div>
      </div>
    </PatientLayout>
  );
}

export default Checkin;
