import { useEffect, useState } from 'react';
import PatientLayout from '../../layouts/PatientLayout';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import Icon from '../../components/common/Icon';
import { getPatientById, updatePatient } from '../../services/patient';
import { useAuth } from '../../context/AuthContext';
import { AVATAR_OPTIONS, getAvatarOption } from '../../utils/avatar';
import { getInitials } from '../../utils/helpers';
import './PersonalInformation.css';

const emptyForm = {
  name: '',
  email: '',
  phone: '',
  dob: '',
  gender: '',
  address: '',
  bloodGroup: '',
  avatarId: 'sage',
};

const toForm = (patient) => ({
  name: patient.name || '',
  email: patient.email || '',
  phone: patient.phone || '',
  dob: patient.dob ? String(patient.dob).slice(0, 10) : '',
  gender: patient.gender ? patient.gender.toUpperCase() : '',
  address: patient.address || '',
  bloodGroup: patient.bloodGroup || '',
  avatarId: patient.avatarId || 'sage',
});

function PersonalInformation() {
  const { user, refreshUser } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      if (!user?.patient?.id) {
        setError('Patient profile is unavailable.');
        setLoading(false);
        return;
      }

      try {
        const patient = await getPatientById(user.patient.id);
        setForm(toForm(patient));
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load your information.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [user?.patient?.id]);

  const handleChange = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
    setSuccess('');
    setError('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updatePatient(user.patient.id, {
        name: form.name,
        phone: form.phone,
        dob: form.dob || undefined,
        gender: form.gender || undefined,
        address: form.address,
        bloodGroup: form.bloodGroup,
        avatarId: form.avatarId,
      });
      const refreshedUser = await refreshUser();
      setForm(toForm({ ...refreshedUser.patient, name: refreshedUser.name, email: refreshedUser.email, phone: refreshedUser.phone }));
      setEditing(false);
      setSuccess('Your information was updated.');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to save your information.');
    } finally {
      setSaving(false);
    }
  };

  const avatar = getAvatarOption(form.avatarId);

  return (
    <PatientLayout>
      <div className="pi-heading">
        <div>
          <p className="pi-eyebrow">Account</p>
          <h2 className="page-title">Personal Information</h2>
        </div>
        {!editing && !loading && <Button title="Edit" onClick={() => setEditing(true)} variant="secondary" />}
      </div>

      {loading ? <Loader /> : (
        <form className="pi-card" onSubmit={handleSubmit}>
          {error && <p className="pi-message pi-message--error" role="alert">{error}</p>}
          {success && <p className="pi-message pi-message--success" role="status"><Icon name="check" size={16} /> {success}</p>}

          <div className="pi-avatar-preview">
            <div className="pi-avatar" style={{ background: avatar?.background, color: avatar?.color }}>{getInitials(form.name || 'Patient')}</div>
            <div>
              <strong>{form.name || 'Patient'}</strong>
              <p>{form.email || 'Email not available'}</p>
            </div>
          </div>

          {editing && (
            <fieldset className="pi-avatar-fieldset">
              <legend>Avatar</legend>
              <div className="pi-avatar-options">
                {AVATAR_OPTIONS.map((option) => (
                  <label key={option.id} className={`pi-avatar-option ${form.avatarId === option.id ? 'pi-avatar-option--selected' : ''}`}>
                    <input type="radio" name="avatarId" value={option.id} checked={form.avatarId === option.id} onChange={handleChange} />
                    <span style={{ background: option.background, color: option.color }}>{getInitials(form.name || 'Patient')}</span>
                    <small>{option.label}</small>
                  </label>
                ))}
              </div>
            </fieldset>
          )}

          <div className="pi-fields">
            <label>Name<input name="name" value={form.name} onChange={handleChange} disabled={!editing} required /></label>
            <label>Email<input name="email" value={form.email} disabled readOnly /></label>
            <label>Phone<input name="phone" value={form.phone} onChange={handleChange} disabled={!editing} /></label>
            <label>Date of birth<input name="dob" type="date" value={form.dob} onChange={handleChange} disabled={!editing} /></label>
            <label>Gender<select name="gender" value={form.gender} onChange={handleChange} disabled={!editing}><option value="">Prefer not to say</option><option value="FEMALE">Female</option><option value="MALE">Male</option><option value="OTHER">Other</option></select></label>
            <label>Blood group<input name="bloodGroup" value={form.bloodGroup} onChange={handleChange} disabled={!editing} /></label>
            <label className="pi-field--full">Address<textarea name="address" value={form.address} onChange={handleChange} disabled={!editing} rows={3} /></label>
          </div>

          {editing && <div className="pi-actions"><Button title={saving ? 'Saving...' : 'Save changes'} type="submit" disabled={saving} /><Button title="Cancel" variant="secondary" onClick={() => { setEditing(false); setError(''); }} disabled={saving} /></div>}
        </form>
      )}
    </PatientLayout>
  );
}

export default PersonalInformation;
