import Navbar from '../components/layout/Navbar';
import BottomNavigation from '../components/layout/BottomNavigation';

function AdminLayout({ children }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--background)' }}>
      <Navbar />
      <main style={{ padding: '20px 20px 100px', maxWidth: '700px', margin: '0 auto' }}>
        {children}
      </main>
      <BottomNavigation role="admin" />
    </div>
  );
}

export default AdminLayout;
