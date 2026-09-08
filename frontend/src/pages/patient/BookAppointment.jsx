import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import { getDoctorById } from '../../services/doctor';
import { bookAppointment } from '../../services/appointment';
import './BookAppointment.css';

const SLOT_GROUPS = [
  { title: 'Morning Slots', slots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
  { title: 'Afternoon Slots', slots: ['12:00 PM', '02:00 PM', '03:00 PM'] },
  { title: 'Evening Slots', slots: ['04:00 PM', '05:00 PM'] },
];

function BookAppointment() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    getDoctorById(id).then((d) => { setDoctor(d); setLoading(false); });
  }, [id]);

  

  const handleBook = async () => {
    if (!selectedDate || !selectedTime) return alert('Please select date and time');
    setBooking(true);
    try {
      const appt = await bookAppointment({
        doctorId: doctor.id,
        doctorName: doctor.name,
        specialty: doctor.specialty,
        patientId: user?.id || 1,
        patientName: user?.name || 'Patient',
        date: selectedDate,
        time: selectedTime,
        notes,
        fee: doctor.fee,
      });
      navigate('/patient/booking-success', { state: { appointment: appt } });
    } finally {
      setBooking(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (loading) return <PatientLayout><Loader /></PatientLayout>;

  return (
    <PatientLayout>
      <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
      <h2 className="page-title">Book Appointment</h2>

      <div className="book-doctor-info">
        <div className="book-doctor-avatar">{doctor?.name?.split(' ').map(w => w[0]).join('')}</div>
        <div>
          <p className="book-doctor-name">{doctor?.name}</p>
          <p className="book-doctor-spec">{doctor?.specialty}</p>
          <p className="book-doctor-fee">Consultation fee: <strong>₹{doctor?.fee}</strong></p>
        </div>
      </div>

      <div className="book-section">
        <h3 className="book-section__title">Select Date</h3>
        <div className="book-date-picker">
          <span className="book-date-icon">📅</span>
          <input
            type="date"
            className="book-date-input"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            min={today}
          />
        </div>
      </div>

      <div className="book-section">
        <h3 className="book-section__title">Select Time Slot</h3>
        <div className="slot-groups">
          {SLOT_GROUPS.map((group) => (
            <div key={group.title} className="slot-group">
              <h4 className="slot-group__heading">{group.title}</h4>
              <div className="slot-grid">
                {group.slots.map((t) => (
                  <button
                    key={t}
                    className={`time-slot ${selectedTime === t ? 'time-slot--active' : ''}`}
                    onClick={() => setSelectedTime(t)}
                    type="button"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="book-section">
        <h3 className="book-section__title">Notes (optional)</h3>
        <textarea
          className="book-notes"
          placeholder="Describe your symptoms or reason for visit..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
        />
      </div>

      <Button title={booking ? 'Booking...' : `Book Appointment — ₹${doctor?.fee}`} onClick={handleBook} disabled={booking || !selectedDate || !selectedTime} />
    </PatientLayout>
  );
}

export default BookAppointment;
