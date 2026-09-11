import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getMedicalRecords } from '../../services/patient';
import { formatDate } from '../../utils/formatDate';
import './MedicalRecords.css';

function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedicalRecords().then((r) => { setRecords(r); setLoading(false); });
  }, [user]);

  const typeIcon = { Report: '📊', Prescription: '💊', 'Lab Report': '🧪' };

  return (
    <PatientLayout>
      <h2 className="page-title">Medical Records</h2>
      {loading ? (
        <Loader />
      ) : records.length === 0 ? (
        <EmptyState icon="📋" title="No records found" description="Your medical records will appear here after your appointments." />
      ) : (
        records.map((r) => (
          <div key={r.id} className="record-card">
            <div className="record-card__icon">{typeIcon[r.type] || '📄'}</div>
            <div className="record-card__info">
              <h3 className="record-card__title">{r.title}</h3>
              <p className="record-card__doctor">By {r.doctor}</p>
              <p className="record-card__date">{formatDate(r.date)}</p>
              <p className="record-card__notes">{r.notes}</p>
            </div>
            <span className="record-card__type">{r.type}</span>
          </div>
        ))
      )}
    </PatientLayout>
  );
}

export default MedicalRecords;
