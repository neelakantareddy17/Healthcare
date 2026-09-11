import { useEffect, useRef, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import { checkIn } from '../../services/queue';
import './QRScanner.css';

function QRScanner() {
  const navigate = useNavigate();
  const scannerRef = useRef(null);
  const checkingInRef = useRef(false);
  const checkedInRef = useRef(false);
  const [checkingIn, setCheckingIn] = useState(false);
  const [checkedIn, setCheckedIn] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 220, height: 220 } }, false);
    scannerRef.current = scanner;

    scanner.render(async (decodedText) => {
      if (checkingInRef.current || checkedInRef.current) return;
      checkingInRef.current = true;
      setCheckingIn(true);
      setError('');
      try {
        await checkIn(decodedText);
        checkedInRef.current = true;
        setCheckedIn(true);
        await scanner.clear();
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Check-in could not be completed.');
      } finally {
        checkingInRef.current = false;
        setCheckingIn(false);
      }
    }, () => {});

    return () => {
      scanner.clear().catch(() => {});
      scannerRef.current = null;
    };
  }, []);

  return (
    <PatientLayout>
      <h2 className="page-title">QR Scanner</h2>
      <p style={{ color: 'var(--text-light)', marginBottom: 24 }}>Scan your appointment QR code at the clinic for quick check-in.</p>
      <div id="qr-reader" className="qr-scanner-box" />
      {checkingIn && <p role="status">Checking in...</p>}
      {checkedIn && (
        <div>
          <p role="status">Checked in successfully. Your queue entry is now active.</p>
          <Button title="View Queue" onClick={() => navigate('/patient/queue')} />
        </div>
      )}
      {error && <p role="alert">{error}</p>}
    </PatientLayout>
  );
}

export default QRScanner;
