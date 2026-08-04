import PatientLayout from '../../layouts/PatientLayout';
import './QRScanner.css';

function QRScanner() {
  return (
    <PatientLayout>
      <h2 className="page-title">QR Scanner</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Scan your appointment QR code at the clinic for quick check-in.</p>
      <div className="qr-scanner-box">
        <div className="qr-scanner-frame">
          <div className="qr-scanner-line" />
          <div className="qr-corner qr-corner--tl" />
          <div className="qr-corner qr-corner--tr" />
          <div className="qr-corner qr-corner--bl" />
          <div className="qr-corner qr-corner--br" />
        </div>
        <p className="qr-scanner-hint">📷 Point your camera at the QR code</p>
      </div>
      <div className="qr-scanner-note">
        <p>🔒 QR scanning requires camera permission. In a real device, this would activate your camera.</p>
      </div>
    </PatientLayout>
  );
}

export default QRScanner;
