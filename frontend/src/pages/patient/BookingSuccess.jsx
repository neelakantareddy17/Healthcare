import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { getStoredPayment, payForAppointment } from '../../services/payment';
import './BookingSuccess.css';

function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const appt = state?.appointment;
  const [paymentMethod, setPaymentMethod] = useState('CARD');
  const [payment, setPayment] = useState(() => getStoredPayment(appt?.id));
  const [paying, setPaying] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const qrSrc = payment?.qrCode || '';
  const amount = payment?.payment?.amount ?? appt?.fee;
  const paidMethod = payment?.payment?.method || paymentMethod;

  const handlePayment = async () => {
    setPaying(true);
    setPaymentError('');
    try {
      const result = await payForAppointment(appt.id, paymentMethod);
      setPayment(result);
    } catch (error) {
      setPaymentError(error.response?.data?.message || 'Payment could not be completed.');
    } finally {
      setPaying(false);
    }
  };

  if (!appt) return <PatientLayout><p>Appointment data not found.</p></PatientLayout>;

  return (
    <PatientLayout>
      <div className="success-container">
        <div className="success-header">
          <div className="success-icon"><Icon name="check" size={28} strokeWidth={2.2} /></div>
          <div className="success-copy">
            <h2 className="success-title">Appointment Created</h2>
            <p className="success-subtitle">Complete payment to confirm your appointment and receive its check-in QR.</p>
          </div>
        </div>

        <div className="success-qr">
          <div className="qr-code">
            {qrSrc ? (
              <img className="qr-image" src={qrSrc} alt="Appointment QR code" />
            ) : (
              <p className="qr-hint">QR available after successful payment.</p>
            )}
          </div>
          {qrSrc && <p className="qr-hint">Show this QR at the clinic for check-in</p>}
        </div>

        <div className="success-details">
          <div className="success-detail-item">
            <span>Amount paying</span>
            <strong>{amount !== undefined && amount !== null ? `₹${amount}` : 'Amount unavailable'}</strong>
          </div>
          <div className="success-detail-item">
            <span>Payment method</span>
            <strong>{paidMethod}</strong>
          </div>
        </div>

        {!payment && (
          <div style={{ marginTop: 24 }}>
            <label htmlFor="payment-method">Payment method</label>
            <select id="payment-method" value={paymentMethod} onChange={(event) => setPaymentMethod(event.target.value)}>
              <option value="CARD">Card</option>
              <option value="UPI">UPI</option>
              <option value="CASH">Cash</option>
              <option value="WALLET">Wallet</option>
            </select>
            <Button title={paying ? 'Processing...' : 'Pay and Confirm'} onClick={handlePayment} disabled={paying} />
            {paymentError && <p role="alert">{paymentError}</p>}
          </div>
        )}

        <div className="success-details">
          <div className="success-detail-item">
            <span><Icon name="doctor" size={16} /> Doctor</span>
            <strong>{appt.doctorName}</strong>
          </div>
          <div className="success-detail-item">
            <span><Icon name="calendar" size={16} /> Date</span>
            <strong>{appt.date}</strong>
          </div>
          <div className="success-detail-item">
            <span><Icon name="clock" size={16} /> Time window</span>
            <strong>{appt.time}</strong>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
}

export default BookingSuccess;
