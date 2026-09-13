import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { getStoredPayment, payForAppointment } from '../../services/payment';
import { formatINR } from '../../utils/currency';
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
  const isPaid = Boolean(payment);

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
        <div className={`success-header ${isPaid ? 'success-header--paid' : ''}`}>
          <div className="success-icon"><Icon name={isPaid ? 'check' : 'creditCard'} size={28} strokeWidth={2.2} /></div>
          <div className="success-copy">
            <h2 className="success-title">{isPaid ? 'Payment successful' : 'Confirm your appointment'}</h2>
            <p className="success-subtitle">{isPaid ? 'Your appointment is confirmed. Keep this QR code for check-in.' : 'Review your visit details and choose a payment method.'}</p>
          </div>
        </div>

        <div className="success-summary">
          <div>
            <span>Appointment summary</span>
            <strong>{appt.doctorName}</strong>
            <small>{appt.date} · {appt.time}</small>
          </div>
          <strong className="success-summary__amount">{formatINR(amount)}</strong>
        </div>

        {!isPaid && (
          <div className="payment-panel">
            <h3>Choose payment method</h3>
            <div className="payment-options" role="radiogroup" aria-label="Payment method">
              {[
                ['CARD', 'Card', 'Pay securely by card'],
                ['UPI', 'UPI', 'Google Pay, PhonePe and more'],
                ['CASH', 'Cash', 'Pay at the clinic'],
                ['WALLET', 'Wallet', 'Use your saved balance'],
              ].map(([value, label, description]) => (
                <label key={value} className={`payment-option ${paymentMethod === value ? 'payment-option--active' : ''}`}>
                  <input type="radio" name="payment-method" value={value} checked={paymentMethod === value} onChange={(event) => setPaymentMethod(event.target.value)} />
                  <span><strong>{label}</strong><small>{description}</small></span>
                </label>
              ))}
            </div>
            <Button title={paying ? 'Processing...' : `Pay ${formatINR(amount)}`} onClick={handlePayment} disabled={paying} />
            {paymentError && <p className="payment-error" role="alert">{paymentError}</p>}
          </div>
        )}

        {isPaid && qrSrc && (
          <div className="success-qr">
            <div className="success-qr__badge"><Icon name="check" size={16} /> Confirmed</div>
            <div className="qr-code">
              <img className="qr-image" src={qrSrc} alt="Appointment QR code" />
            </div>
            <p className="qr-hint">Show this QR at the clinic for check-in</p>
          </div>
        )}

        <div className="success-details">
          <div className="success-detail-item">
            <span>Amount</span>
            <strong>{formatINR(amount)}</strong>
          </div>
          <div className="success-detail-item">
            <span>Payment method</span>
            <strong>{isPaid ? paidMethod : 'Not selected'}</strong>
          </div>
        </div>

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
