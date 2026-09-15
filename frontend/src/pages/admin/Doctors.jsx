import { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Icon from '../../components/common/Icon';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import { createDoctor, deleteDoctor, getDoctors, updateDoctor } from '../../services/doctor';
import { getDepartments } from '../../services/department';
import { getInitials } from '../../utils/helpers';

const emptyForm = {
  name: '', email: '', password: '', phone: '', departmentId: '', specialization: '',
  experienceYears: '', consultationFee: '', qualification: '',
};

const fieldStyle = {
  width: '100%', height: 52, borderRadius: 15, border: '1.5px solid var(--border)',
  padding: '0 16px', fontSize: 15, background: '#fff', color: 'var(--text)',
};

const getErrorMessage = (error) => error.response?.data?.message || error.message || 'Something went wrong';
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [departmentsLoading, setDepartmentsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingDoctor, setEditingDoctor] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState({ type: '', text: '' });

  const loadData = async () => {
    setLoading(true);
    setDepartmentsLoading(true);

    const doctorRequest = getDoctors()
      .then(setDoctors)
      .catch((error) => setNotice({ type: 'error', text: getErrorMessage(error) }))
      .finally(() => setLoading(false));
    const departmentRequest = getDepartments()
      .then(setDepartments)
      .catch((error) => setNotice({ type: 'error', text: `Departments could not be loaded: ${getErrorMessage(error)}` }))
      .finally(() => setDepartmentsLoading(false));

    await Promise.all([doctorRequest, departmentRequest]);
  };

  useEffect(() => { loadData(); }, []);

  const openCreate = () => {
    setEditingDoctor(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (doctor) => {
    setEditingDoctor(doctor);
    setForm({
      ...emptyForm,
      name: doctor.name || '',
      phone: doctor.phone || '',
      departmentId: doctor.departmentId || '',
      specialization: doctor.specialty || '',
      experienceYears: doctor.experienceYears ?? '',
      consultationFee: doctor.consultationFee ?? doctor.fee ?? '',
      qualification: doctor.qualification || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  };

  const validateForm = () => {
    if (form.name.trim().length < 2) return 'Name must be at least 2 characters';
    if (!editingDoctor && !/^\S+@\S+\.\S+$/.test(form.email)) return 'Enter a valid email address';
    if (!editingDoctor && form.password.length < 6) return 'Password must be at least 6 characters';
    if (!uuidPattern.test(form.departmentId)) return 'Select a valid department';
    if (form.specialization.trim().length < 2) return 'Specialization must be at least 2 characters';
    if (form.experienceYears !== '' && (!Number.isInteger(Number(form.experienceYears)) || Number(form.experienceYears) < 0)) return 'Experience must be a non-negative integer';
    if (!form.consultationFee || !Number.isFinite(Number(form.consultationFee)) || Number(form.consultationFee) <= 0) return 'Consultation fee must be positive';
    return '';
  };

  const submitForm = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setFormError(validationError);
      return;
    }

    const payload = {
      name: form.name.trim(),
      phone: form.phone.trim(),
      departmentId: form.departmentId,
      specialization: form.specialization.trim(),
      ...(form.experienceYears !== '' ? { experienceYears: Number(form.experienceYears) } : {}),
      consultationFee: Number(form.consultationFee),
      qualification: form.qualification.trim(),
    };
    if (!editingDoctor) Object.assign(payload, { email: form.email.trim(), password: form.password });

    setSubmitting(true);
    setFormError('');
    try {
      if (editingDoctor) await updateDoctor(editingDoctor.id, payload);
      else await createDoctor(payload);
      setModalOpen(false);
      setNotice({ type: 'success', text: editingDoctor ? 'Doctor updated successfully' : 'Doctor added successfully' });
      await loadData();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (doctor) => {
    if (!window.confirm(`Deactivate ${doctor.name}?`)) return;
    setNotice({ type: '', text: '' });
    try {
      await deleteDoctor(doctor.id);
      setNotice({ type: 'success', text: 'Doctor deactivated successfully' });
      await loadData();
    } catch (error) {
      setNotice({ type: 'error', text: getErrorMessage(error) });
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, marginBottom: 20 }}>
        <h2 style={{ fontSize: 24, fontWeight: 800 }}>Manage Doctors</h2>
        <Button title="Add Doctor" onClick={openCreate} style={{ width: 'auto', height: 44, padding: '0 16px', fontSize: 14, borderRadius: 13 }} />
      </div>
      {notice.text && <p style={{ padding: '12px 14px', borderRadius: 12, marginBottom: 16, background: notice.type === 'error' ? '#fee2e2' : '#dcfce7', color: notice.type === 'error' ? '#b91c1c' : '#166534', fontSize: 13, fontWeight: 600 }}>{notice.text}</p>}
      {loading ? <Loader /> : doctors.map((d) => (
        <div key={d.id} style={{ background: '#fff', borderRadius: 18, padding: 16, marginBottom: 12, boxShadow: '0 4px 14px rgba(0,0,0,0.06)', display: 'flex', gap: 14, alignItems: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'var(--primary-soft)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 16, color: 'var(--primary)', flexShrink: 0 }}>
            {getInitials(d.name)}
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: 15, marginBottom: 2 }}>{d.name}</p>
            <p style={{ fontSize: 13, color: 'var(--primary)', fontWeight: 600, marginBottom: 2 }}>{d.specialty}</p>
            <p style={{ fontSize: 12, color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: 4 }}><Icon name="doctor" size={13} /> {d.department?.name || d.hospital || 'General department'}</p>
          </div>
          <Badge label={d.available ? 'Active' : 'Inactive'} type={d.available ? 'success' : 'danger'} />
          <Button title="Edit" variant="ghost" onClick={() => openEdit(d)} style={{ width: 'auto', height: 36, padding: '0 10px', fontSize: 13 }} />
          {d.available && <Button title="Deactivate" variant="ghost" onClick={() => handleDelete(d)} style={{ width: 'auto', height: 36, padding: '0 10px', fontSize: 13, color: '#dc2626' }} />}
        </div>
      ))}
      {!loading && doctors.length === 0 && <p style={{ color: 'var(--text-light)', textAlign: 'center', padding: 32 }}>No doctors found.</p>}
      <Modal isOpen={modalOpen} onClose={() => !submitting && setModalOpen(false)} title={editingDoctor ? 'Edit Doctor' : 'Add Doctor'}>
        <form onSubmit={submitForm}>
          <Input label="Name" name="name" value={form.name} onChange={updateField} placeholder="Doctor name" required />
          {!editingDoctor && <>
            <Input label="Email" name="email" type="email" value={form.email} onChange={updateField} placeholder="doctor@example.com" required />
            <Input label="Password" name="password" type="password" value={form.password} onChange={updateField} placeholder="Minimum 6 characters" required />
          </>}
          <Input label="Phone" name="phone" value={form.phone} onChange={updateField} placeholder="Phone number" />
          <label className="input-label">Department</label>
          <select name="departmentId" value={form.departmentId} onChange={updateField} style={{ ...fieldStyle, marginBottom: 16, cursor: 'pointer' }} required disabled={departmentsLoading}>
            <option value="">{departmentsLoading ? 'Loading departments...' : departments.length ? 'Select department' : 'No departments available'}</option>
            {departments.map((department) => <option key={department.id} value={department.id}>{department.name}</option>)}
          </select>
          <Input label="Specialization" name="specialization" value={form.specialization} onChange={updateField} placeholder="e.g. Cardiology" required />
          <Input label="Experience (years)" name="experienceYears" type="number" value={form.experienceYears} onChange={updateField} placeholder="0" />
          <Input label="Consultation fee" name="consultationFee" type="number" value={form.consultationFee} onChange={updateField} placeholder="0" required />
          <Input label="Qualification" name="qualification" value={form.qualification} onChange={updateField} placeholder="e.g. MBBS, MD" />
          {formError && <p style={{ color: '#b91c1c', background: '#fee2e2', borderRadius: 10, padding: '10px 12px', fontSize: 13, marginBottom: 16 }}>{formError}</p>}
          <Button title={submitting ? 'Saving...' : editingDoctor ? 'Save Changes' : 'Create Doctor'} type="submit" disabled={submitting} />
        </form>
      </Modal>
    </AdminLayout>
  );
}

export default Doctors;
