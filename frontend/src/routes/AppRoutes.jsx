import { Routes, Route, Navigate } from 'react-router-dom';
import RoleRoute from './RoleRoute';

// Auth
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Patient
import PatientHome from '../pages/patient/Home';
import FindDoctor from '../pages/patient/FindDoctor';
import DoctorDetails from '../pages/patient/DoctorDetails';
import BookAppointment from '../pages/patient/BookAppointment';
import BookingSuccess from '../pages/patient/BookingSuccess';
import QRScanner from '../pages/patient/QRScanner';
import QueueStatus from '../pages/patient/QueueStatus';
import MedicalRecords from '../pages/patient/MedicalRecords';
import Notifications from '../pages/patient/Notifications';
import Profile from '../pages/patient/Profile';

// Doctor
import DoctorDashboard from '../pages/doctor/Dashboard';
import QueueManagement from '../pages/doctor/QueueManagement';
import DoctorPatients from '../pages/doctor/Patients';
import Schedule from '../pages/doctor/Schedule';
import DoctorProfile from '../pages/doctor/DoctorProfile';

// Admin
import AdminDashboard from '../pages/admin/Dashboard';
import AdminUsers from '../pages/admin/Users';
import AdminDoctors from '../pages/admin/Doctors';
import AdminPatients from '../pages/admin/Patients';
import AdminReports from '../pages/admin/Reports';

function AppRoutes() {
  return (
    <Routes>
      {/* Default redirect */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Patient routes */}
      <Route path="/patient" element={<RoleRoute role="patient"><PatientHome /></RoleRoute>} />
      <Route path="/patient/find-doctor" element={<RoleRoute role="patient"><FindDoctor /></RoleRoute>} />
      <Route path="/patient/doctor/:id" element={<RoleRoute role="patient"><DoctorDetails /></RoleRoute>} />
      <Route path="/patient/book/:id" element={<RoleRoute role="patient"><BookAppointment /></RoleRoute>} />
      <Route path="/patient/booking-success" element={<RoleRoute role="patient"><BookingSuccess /></RoleRoute>} />
      <Route path="/patient/qr-scanner" element={<RoleRoute role="patient"><QRScanner /></RoleRoute>} />
      <Route path="/patient/queue" element={<RoleRoute role="patient"><QueueStatus /></RoleRoute>} />
      <Route path="/patient/medical-records" element={<RoleRoute role="patient"><MedicalRecords /></RoleRoute>} />
      <Route path="/patient/notifications" element={<RoleRoute role="patient"><Notifications /></RoleRoute>} />
      <Route path="/patient/profile" element={<RoleRoute role="patient"><Profile /></RoleRoute>} />

      {/* Doctor routes */}
      <Route path="/doctor" element={<RoleRoute role="doctor"><DoctorDashboard /></RoleRoute>} />
      <Route path="/doctor/queue" element={<RoleRoute role="doctor"><QueueManagement /></RoleRoute>} />
      <Route path="/doctor/patients" element={<RoleRoute role="doctor"><DoctorPatients /></RoleRoute>} />
      <Route path="/doctor/schedule" element={<RoleRoute role="doctor"><Schedule /></RoleRoute>} />
      <Route path="/doctor/profile" element={<RoleRoute role="doctor"><DoctorProfile /></RoleRoute>} />

      {/* Admin routes */}
      <Route path="/admin" element={<RoleRoute role="admin"><AdminDashboard /></RoleRoute>} />
      <Route path="/admin/users" element={<RoleRoute role="admin"><AdminUsers /></RoleRoute>} />
      <Route path="/admin/doctors" element={<RoleRoute role="admin"><AdminDoctors /></RoleRoute>} />
      <Route path="/admin/patients" element={<RoleRoute role="admin"><AdminPatients /></RoleRoute>} />
      <Route path="/admin/reports" element={<RoleRoute role="admin"><AdminReports /></RoleRoute>} />

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default AppRoutes;
