import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';
import './PatientLayout.css';

function PatientLayout({ children }) {
  return (
    <div className="patient-layout">
      <Navbar />
      <main className="patient-layout__main">{children}</main>
      <BottomNavigation role="patient" />
    </div>
  );
}

export default PatientLayout;
