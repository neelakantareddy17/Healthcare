import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Badge from '../../components/common/Badge';
import { getDoctorById } from '../../services/doctor';
import { getInitials } from '../../utils/helpers';
import './DoctorDetails.css';

function DoctorDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDoctorById(id).then((d) => { setDoctor(d); setLoading(false); });
  }, [id]);

  if (loading) return <PatientLayout><Loader /></PatientLayout>;
  if (!doctor) return <PatientLayout><p>Doctor not found.</p></PatientLayout>;

  return (
    <PatientLayout>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>

      <div className="doc-profile">
        <div className="doc-profile__avatar">{getInitials(doctor.name)}</div>
        <h2 className="doc-profile__name">{doctor.name}</h2>
        <p className="doc-profile__specialty">{doctor.specialty}</p>
        <Badge label={doctor.available ? 'Available Today' : 'Not Available'} type={doctor.available ? 'success' : 'danger'} />
      </div>

      <div className="doc-stats">
        <div className="doc-stat"><span className="doc-stat__num">{doctor.experience}+</span><span>Years Exp</span></div>
        <div className="doc-stat"><span className="doc-stat__num">{doctor.rating}</span><span>Rating</span></div>
        <div className="doc-stat"><span className="doc-stat__num">{doctor.reviews}</span><span>Reviews</span></div>
        <div className="doc-stat"><span className="doc-stat__num">₹{doctor.fee}</span><span>Fee</span></div>
      </div>

      <div className="doc-info-card">
        <h3>About</h3>
        <p>{doctor.about}</p>
      </div>

      <div className="doc-info-card">
        <h3>Hospital</h3>
        <p>🏥 {doctor.hospital}, {doctor.city}</p>
      </div>

      <div className="ai-reco">
        <span>🤖</span>
        <div>
          <p className="ai-reco__title">AI Match Score: 94%</p>
          <p className="ai-reco__text">Highly recommended based on your health profile and location.</p>
        </div>
      </div>

      <div style={{ marginTop: 24 }}>
        <Button title="Book Appointment" onClick={() => navigate(`/patient/book/${doctor.id}`)} disabled={!doctor.available} />
      </div>
    </PatientLayout>
  );
}

export default DoctorDetails;
