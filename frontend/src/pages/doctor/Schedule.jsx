import DoctorLayout from '../../layouts/DoctorLayout';
import './Schedule.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const SLOTS = ['09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM', '05:00 PM'];
const BOOKED = ['09:00 AM', '11:00 AM', '03:00 PM'];

function Schedule() {
  return (
    <DoctorLayout>
      <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 20 }}>My Schedule</h2>
      <div className="sched-days">
        {DAYS.map((d, i) => (
          <button key={d} className={`sched-day ${i === 0 ? 'sched-day--active' : ''}`}>{d}</button>
        ))}
      </div>
      <h3 className="sched-section">Time Slots — Monday</h3>
      <div className="sched-slots">
        {SLOTS.map((slot) => (
          <div key={slot} className={`sched-slot ${BOOKED.includes(slot) ? 'sched-slot--booked' : 'sched-slot--free'}`}>
            <span className="sched-slot__time">{slot}</span>
            <span className="sched-slot__status">{BOOKED.includes(slot) ? '● Booked' : '○ Free'}</span>
          </div>
        ))}
      </div>
    </DoctorLayout>
  );
}

export default Schedule;
