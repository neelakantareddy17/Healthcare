import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientLayout from '../../layouts/PatientLayout';
import Button from '../../components/common/Button';
import Loader from '../../components/common/Loader';
import Icon from '../../components/common/Icon';
import { getDoctorById } from '../../services/doctor';
import { bookAppointment } from '../../services/appointment';
import { getLocalDateInputValue, isTimeSlotPast } from '../../utils/date';
import './BookAppointment.css';

const SLOT_GROUPS = [
  { title: 'Morning Slots', slots: ['09:00 AM', '10:00 AM', '11:00 AM'] },
  { title: 'Afternoon Slots', slots: ['12:00 PM', '02:00 PM', '03:00 PM'] },
  { title: 'Evening Slots', slots: ['04:00 PM', '05:00 PM'] },
];

function BookAppointment() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState(false);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [notes, setNotes] = useState('');
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    getDoctorById(id).then((d) => { setDoctor(d); setLoading(false); });
  }, [id]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 30000);
    return () => window.clearInterval(timer);
  }, []);

  const today = getLocalDateInputValue(now);
  const selectedTimeIsPast = isTimeSlotPast(selectedTime, selectedDate, now);

  const handleDateChange = (event) => {
    const nextDate = event.target.value;
    setSelectedDate(nextDate);
    if (isTimeSlotPast(selectedTime, nextDate)) setSelectedTime('');
  };

  const handleBook = async () => {
    if (!selectedDate || !selectedTime || selectedTimeIsPast) return alert('Please select a future date and time slot');
    setBooking(true);
    try {
      const appointment = await bookAppointment({
        doctorId: doctor.id,
        appointmentDate: selectedDate,
        timeSlot: selectedTime,
        reason: notes,
      });
      navigate('/patient/booking-success', { state: { appointment } });
    } finally {
      setBooking(false);
    }
  };

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
          <Icon name="calendar" size={20} className="book-date-icon" />
          <input
            type="date"
            className="book-date-input"
            value={selectedDate}
            onChange={handleDateChange}
            min={today}
          />
        </div>
      </div>

      <div className="book-section">
        <h3 className="book-section__title">Select Time Slot</h3>
        <p className="book-section__hint">Choose a 60-minute arrival window. Your exact consultation time may vary with the clinic queue.</p>
        <div className="slot-groups">
          {SLOT_GROUPS.map((group) => (
            <div key={group.title} className="slot-group">
              <h4 className="slot-group__heading">{group.title}</h4>
              <div className="slot-grid">
                {group.slots.map((timeSlot) => (
                  <button
                    key={timeSlot}
                    className={`time-slot ${selectedTime === timeSlot ? 'time-slot--active' : ''}`}
                    onClick={() => setSelectedTime(timeSlot)}
                    disabled={isTimeSlotPast(timeSlot, selectedDate, now)}
                    type="button"
                  >
                    {timeSlot}
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

          <Button title={booking ? 'Booking...' : `Book Appointment — ₹${doctor?.fee}`} onClick={handleBook} disabled={booking || !selectedDate || !selectedTime || selectedTimeIsPast} />
    </PatientLayout>
  );
}

export default BookAppointment;
