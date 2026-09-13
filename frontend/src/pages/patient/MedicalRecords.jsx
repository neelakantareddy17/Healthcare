import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { getMedicalRecords } from '../../services/patient';
import { formatDate } from '../../utils/formatDate';
import Icon from '../../components/common/Icon';
import './MedicalRecords.css';

function MedicalRecords() {
  const { user } = useAuth();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getMedicalRecords().then((r) => { setRecords(r); setLoading(false); });
  }, [user]);

  const typeIcon = { Report: 'activity', Prescription: 'clipboard', 'Lab Report': 'lab' };

  return (
    <PatientLayout>
      <h2 className="page-title">Medical History</h2>
      {loading ? (
        <Loader />
      ) : records.length === 0 ? (
        <EmptyState icon="clipboard" title="Medical history is not available yet" description="The current account does not have a medical-history record service. Appointment information remains available in My Bookings." />
      ) : (
        records.map((r) => (
          <div key={r.id} className="record-card">
            <div className="record-card__icon"><Icon name={typeIcon[r.type] || 'document'} size={20} /></div>
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
