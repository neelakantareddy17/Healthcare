import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';

function DoctorLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar />
      <main style={{ padding: '20px 20px 100px', maxWidth: '600px', margin: '0 auto' }}>
        {children}
      </main>
      <BottomNavigation role="doctor" />
    </div>
  );
}

export default DoctorLayout;
