import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import PatientLayout from '../../layouts/PatientLayout';
import './Profile.css';

const FALLBACK = {
  name: 'Alex Johnson',
  email: 'alex.johnson@email.com',
  phone: '+1 (555) 234-5678',
  dob: '15 March 1990',
  gender: 'Male',
  address: '123 Maple Street, New York, NY 10001',
  photo: '',
  membership: 'Premium Member',
  bloodType: 'O+',
  weightKg: 72,
  heightCm: 180,
  healthScore: 87,
  allergies: ['Penicillin', 'Dust Mites'],
  conditions: ['Mild Hypertension'],
  insurance: {
    provider: 'BlueCross BlueShield',
    policyNo: 'BCB-2024-88421',
    group: 'GRP-44921',
    expires: 'Dec 2025',
    coverage: 'Comprehensive',
  },
  payments: [
    {
      id: 'pay-1',
      type: 'PhonePe',
      handle: 'alex.johnson@ybl',
      phone: '+91 98765 43210',
      bank: 'Yes Bank',
      primary: true,
      gradient: 'linear-gradient(135deg, #5f259f 0%, #3a0d6e 100%)',
    },
    {
      id: 'pay-2',
      type: 'BHIM UPI',
      handle: 'alexjohnson@upi',
      phone: '+91 98765 43210',
      bank: 'State Bank of India',
      primary: false,
      gradient: 'linear-gradient(135deg, #0d7065 0%, #064e46 100%)',
    },
  ],
  activity: [
    { icon: '🩺', text: 'Appointment with Dr. Smith', time: '2 days ago' },
    { icon: '💊', text: 'Prescription renewed', time: '5 days ago' },
    { icon: '🧪', text: 'Lab results uploaded', time: '1 week ago' },
    { icon: '📋', text: 'Insurance verified', time: '2 weeks ago' },
  ],
  records: [
    {
      id: 'rec-1',
      title: 'Complete Blood Count (CBC)',
      type: 'Lab Report',
      date: '28 Aug 2026',
      doctor: 'Dr. Sarah Wilson',
      facility: 'Metro Diagnostics',
      badge: 'Lab Test',
      badgeColor: '#0284c7',
      badgeBg: 'rgba(2,132,199,0.10)',
      icon: '🧪',
      fileSize: '1.8 MB',
    },
    {
      id: 'rec-2',
      title: 'Cardiology ECG & Consultation',
      type: 'Cardiology',
      date: '15 Aug 2026',
      doctor: 'Dr. Michael Chen',
      facility: 'Heart & Vascular Clinic',
      badge: 'Consultation',
      badgeColor: '#059669',
      badgeBg: 'rgba(5,150,105,0.10)',
      icon: '🩺',
      fileSize: '3.4 MB',
    },
    {
      id: 'rec-3',
      title: 'Lisinopril & Vitamin D3 Prescription',
      type: 'Prescription',
      date: '10 Aug 2026',
      doctor: 'Dr. Sarah Wilson',
      facility: 'Central Clinic Pharmacy',
      badge: 'Prescription',
      badgeColor: '#7c3aed',
      badgeBg: 'rgba(124,58,237,0.10)',
      icon: '💊',
      fileSize: '850 KB',
    },
    {
      id: 'rec-4',
      title: 'Chest X-Ray Digital Imaging',
      type: 'Radiology',
      date: '02 Jul 2026',
      doctor: 'Dr. Emily Vance',
      facility: 'City Diagnostic Imaging',
      badge: 'Imaging',
      badgeColor: '#ea580c',
      badgeBg: 'rgba(234,88,12,0.10)',
      icon: '📋',
      fileSize: '12.4 MB',
    },
  ],
};

function Modal({ title, onClose, children }) {
  return (
    <div className="pf-modal-overlay" onClick={onClose}>
      <div className="pf-modal" onClick={(e) => e.stopPropagation()}>
        <div className="pf-modal-header">
          <h3 className="pf-modal-title">{title}</h3>
          <button className="pf-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <div className="pf-modal-body">{children}</div>
      </div>
    </div>
  );
}

function PersonalInfoModal({ profile, onClose }) {
  const [editing, setEditing] = useState(false);
  const fields = [
    { label: 'Full Name', value: profile.name, icon: '👤' },
    { label: 'Email', value: profile.email, icon: '✉️' },
    { label: 'Phone', value: profile.phone, icon: '📱' },
    { label: 'Date of Birth', value: profile.dob, icon: '🎂' },
    { label: 'Gender', value: profile.gender, icon: '⚧' },
    { label: 'Address', value: profile.address, icon: '📍' },
  ];
  return (
    <Modal title="Personal Information" onClose={onClose}>
      <div className="pf-modal-fields">
        {fields.map((f) => (
          <div className="pf-field-row" key={f.label}>
            <span className="pf-field-icon">{f.icon}</span>
            <div className="pf-field-content">
              <p className="pf-field-label">{f.label}</p>
              {editing ? (
                <input className="pf-field-input" defaultValue={f.value} />
              ) : (
                <p className="pf-field-value">{f.value}</p>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="pf-modal-actions">
        {editing ? (
          <>
            <button className="pf-btn pf-btn--primary" onClick={() => setEditing(false)}>Save Changes</button>
            <button className="pf-btn pf-btn--ghost" onClick={() => setEditing(false)}>Cancel</button>
          </>
        ) : (
          <button className="pf-btn pf-btn--primary" onClick={() => setEditing(true)}>
            ✏️ Edit Information
          </button>
        )}
      </div>
    </Modal>
  );
}

function MedicalRecordsModal({ profile, onClose }) {
  const [downloadingId, setDownloadingId] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(null);
  const records = profile.records || FALLBACK.records;

  const handleDownload = (rec) => {
    setDownloadingId(rec.id);
    setTimeout(() => {
      setDownloadingId(null);
      setDownloadSuccess(rec.title);
      setTimeout(() => setDownloadSuccess(null), 2500);
    }, 600);
  };

  return (
    <Modal title="Medical Records" onClose={onClose}>
      {downloadSuccess && (
        <div className="pf-toast-success">
          <span>✓</span> Downloaded &ldquo;{downloadSuccess}&rdquo;
        </div>
      )}
      <div className="pf-records-list">
        {records.map((rec) => (
          <div className="pf-record-card" key={rec.id}>
            <div className="pf-record-top">
              <span className="pf-record-icon">{rec.icon}</span>
              <div className="pf-record-main">
                <div className="pf-record-header">
                  <h4 className="pf-record-title">{rec.title}</h4>
                  <span
                    className="pf-record-badge"
                    style={{ color: rec.badgeColor, backgroundColor: rec.badgeBg }}
                  >
                    {rec.badge}
                  </span>
                </div>
                <p className="pf-record-meta">
                  {rec.doctor} · {rec.facility}
                </p>
                <div className="pf-record-footer">
                  <span className="pf-record-date">📅 {rec.date}</span>
                  <span className="pf-record-size">💾 {rec.fileSize}</span>
                  <button
                    className="pf-record-dl-btn"
                    onClick={() => handleDownload(rec)}
                    disabled={downloadingId === rec.id}
                    title="Download Record"
                  >
                    {downloadingId === rec.id ? (
                      <span>⏳ Saving...</span>
                    ) : (
                      <>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                          <path d="M12 3v12m0 0l-4-4m4 4l4-4M4 17v2a2 2 0 002 2h12a2 2 0 002-2v-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Download</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="pf-modal-actions" style={{ marginTop: '16px' }}>
        <button className="pf-add-btn" style={{ margin: 0 }}>
          + Upload New Record
        </button>
      </div>
    </Modal>
  );
}

const MedicalHistoryModal = MedicalRecordsModal;

function InsuranceModal({ profile, onClose }) {
  const ins = profile.insurance;
  return (
    <Modal title="Insurance Details" onClose={onClose}>
      <div className="pf-ins-card">
        <div className="pf-ins-logo">🛡️</div>
        <p className="pf-ins-provider">{ins.provider}</p>
        <p className="pf-ins-coverage">{ins.coverage} Coverage</p>
      </div>
      <div className="pf-modal-fields">
        {[
          { label: 'Policy Number', value: ins.policyNo, icon: '📄' },
          { label: 'Group Number', value: ins.group, icon: '👥' },
          { label: 'Expiry Date', value: ins.expires, icon: '📅' },
          { label: 'Coverage Type', value: ins.coverage, icon: '✅' },
        ].map((f) => (
          <div className="pf-field-row" key={f.label}>
            <span className="pf-field-icon">{f.icon}</span>
            <div className="pf-field-content">
              <p className="pf-field-label">{f.label}</p>
              <p className="pf-field-value">{f.value}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pf-modal-actions">
        <button className="pf-btn pf-btn--primary">📥 Download Card</button>
        <button className="pf-btn pf-btn--ghost">Update Insurance</button>
      </div>
    </Modal>
  );
}

function PaymentModal({ profile, onClose }) {
  const [payments, setPayments] = useState(profile.payments || FALLBACK.payments);
  const [selected, setSelected] = useState(0);
  const [showAdd, setShowAdd] = useState(false);
  const [newUpi, setNewUpi] = useState({ type: 'PhonePe', handle: '' });
  const [copiedId, setCopiedId] = useState(null);
  const [statusMsg, setStatusMsg] = useState(null);

  const handleCopy = (handle, id) => {
    navigator.clipboard?.writeText(handle);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSetPrimary = (index) => {
    setPayments((prev) =>
      prev.map((p, i) => ({ ...p, primary: i === index }))
    );
    setStatusMsg('Primary payment method updated!');
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleRemove = (index) => {
    if (payments.length <= 1) {
      alert('You must keep at least one payment method.');
      return;
    }
    const updated = payments.filter((_, i) => i !== index);
    if (!updated.some((p) => p.primary) && updated.length > 0) {
      updated[0].primary = true;
    }
    setPayments(updated);
    setSelected(0);
    setStatusMsg('Payment method removed.');
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newUpi.handle.trim() || !newUpi.handle.includes('@')) {
      alert('Please enter a valid UPI ID (e.g. name@upi or number@ybl)');
      return;
    }
    const isPhonePe = newUpi.type === 'PhonePe';
    const newEntry = {
      id: `pay-${Date.now()}`,
      type: newUpi.type,
      handle: newUpi.handle.trim(),
      phone: '+91 98765 43210',
      bank: isPhonePe ? 'Yes Bank' : 'NPCI / UPI',
      primary: false,
      gradient: isPhonePe
        ? 'linear-gradient(135deg, #5f259f 0%, #3a0d6e 100%)'
        : 'linear-gradient(135deg, #0d7065 0%, #064e46 100%)',
    };
    setPayments([...payments, newEntry]);
    setShowAdd(false);
    setNewUpi({ type: 'PhonePe', handle: '' });
    setStatusMsg(`${newUpi.type} ID linked successfully!`);
    setTimeout(() => setStatusMsg(null), 2500);
  };

  return (
    <Modal title="Payment Methods" onClose={onClose}>
      {statusMsg && (
        <div className="pf-toast-success">
          <span>✓</span> {statusMsg}
        </div>
      )}

      {!showAdd ? (
        <>
          <div className="pf-cards-list">
            {payments.map((pay, i) => (
              <div
                key={pay.id || i}
                className={`pf-pay-card ${selected === i ? 'pf-pay-card--selected' : ''}`}
                style={{ background: pay.gradient }}
                onClick={() => setSelected(i)}
              >
                <div className="pf-pay-card-top">
                  <div className="pf-pay-badge-group">
                    <span className="pf-pay-type-icon">{pay.type === 'PhonePe' ? '🟣' : '⚡'}</span>
                    <span className="pf-pay-type">{pay.type}</span>
                  </div>
                  {pay.primary ? (
                    <span className="pf-primary-badge">★ Primary UPI</span>
                  ) : (
                    <button
                      type="button"
                      className="pf-set-primary-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSetPrimary(i);
                      }}
                    >
                      Set Primary
                    </button>
                  )}
                </div>

                <div className="pf-upi-row">
                  <span className="pf-pay-number">{pay.handle}</span>
                  <button
                    type="button"
                    className="pf-upi-copy-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCopy(pay.handle, pay.id || i);
                    }}
                    title="Copy UPI ID"
                  >
                    {copiedId === (pay.id || i) ? '✓ Copied' : 'Copy'}
                  </button>
                </div>

                <div className="pf-pay-footer-row">
                  <span className="pf-pay-expiry">📱 {pay.phone}</span>
                  <span className="pf-pay-bank">🏦 {pay.bank}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="pf-modal-actions">
            <button className="pf-btn pf-btn--primary" onClick={() => setShowAdd(true)}>
              + Link New UPI / PhonePe ID
            </button>
            <button className="pf-btn pf-btn--danger" onClick={() => handleRemove(selected)}>
              Remove Selected
            </button>
          </div>
        </>
      ) : (
        <form onSubmit={handleAddSubmit} className="pf-add-upi-form">
          <div className="pf-upi-type-select">
            <button
              type="button"
              className={`pf-upi-choice ${newUpi.type === 'PhonePe' ? 'pf-upi-choice--active' : ''}`}
              onClick={() => setNewUpi({ ...newUpi, type: 'PhonePe' })}
            >
              🟣 PhonePe
            </button>
            <button
              type="button"
              className={`pf-upi-choice ${newUpi.type === 'BHIM UPI' ? 'pf-upi-choice--active' : ''}`}
              onClick={() => setNewUpi({ ...newUpi, type: 'BHIM UPI' })}
            >
              ⚡ Other UPI
            </button>
          </div>

          <div className="pf-pw-field" style={{ marginTop: '14px' }}>
            <label className="pf-field-label">
              {newUpi.type === 'PhonePe' ? 'PhonePe UPI ID / Number' : 'UPI ID (VPA)'}
            </label>
            <input
              type="text"
              className="pf-field-input"
              placeholder={newUpi.type === 'PhonePe' ? 'e.g. 9876543210@ybl' : 'e.g. yourname@upi'}
              value={newUpi.handle}
              onChange={(e) => setNewUpi({ ...newUpi, handle: e.target.value })}
              autoFocus
            />
            <p className="pf-input-hint">Verified automatically with NPCI / UPI network</p>
          </div>

          <div className="pf-modal-actions" style={{ marginTop: '18px' }}>
            <button type="submit" className="pf-btn pf-btn--primary">
              Verify & Link UPI ID
            </button>
            <button
              type="button"
              className="pf-btn pf-btn--ghost"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function ChangePasswordForm({ onBack }) {
  const [form, setForm] = useState({ current: '', next: '', confirm: '' });
  const [show, setShow] = useState({ current: false, next: false, confirm: false });
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const getStrength = (pw) => {
    let score = 0;
    if (pw.length >= 8)  score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    return score; // 0-4
  };

  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColors = ['', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
  const strength = getStrength(form.next);

  const validate = () => {
    const e = {};
    if (!form.current)           e.current = 'Current password is required.';
    if (form.next.length < 8)    e.next    = 'New password must be at least 8 characters.';
    if (form.next !== form.confirm) e.confirm = 'Passwords do not match.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1400);
  };

  const EyeIcon = ({ visible }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      {visible ? (
        <>
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8S1 12 1 12z" stroke="currentColor" strokeWidth="1.8" />
          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.8" />
        </>
      ) : (
        <>
          <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19M1 1l22 22" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </>
      )}
    </svg>
  );

  if (success) {
    return (
      <div className="pf-pw-success">
        <div className="pf-pw-success-icon">✅</div>
        <h4 className="pf-pw-success-title">Password Changed!</h4>
        <p className="pf-pw-success-sub">Your password has been updated successfully.</p>
        <button className="pf-btn pf-btn--primary" style={{ marginTop: 18 }} onClick={onBack}>
          Back to Security
        </button>
      </div>
    );
  }

  return (
    <form className="pf-pw-form" onSubmit={handleSubmit} noValidate>
      <button type="button" className="pf-pw-back" onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back
      </button>

      <h4 className="pf-pw-heading">🔑 Change Password</h4>
      <p className="pf-pw-desc">Choose a strong password you haven't used before.</p>

      {/* Current Password */}
      <div className="pf-pw-group">
        <label className="pf-pw-label">Current Password</label>
        <div className={`pf-pw-input-wrap ${errors.current ? 'pf-pw-input-wrap--err' : ''}`}>
          <input
            type={show.current ? 'text' : 'password'}
            className="pf-pw-input"
            placeholder="Enter current password"
            value={form.current}
            onChange={(e) => setForm({ ...form, current: e.target.value })}
          />
          <button type="button" className="pf-pw-eye" onClick={() => setShow({ ...show, current: !show.current })}>
            <EyeIcon visible={show.current} />
          </button>
        </div>
        {errors.current && <p className="pf-pw-error">{errors.current}</p>}
      </div>

      {/* New Password */}
      <div className="pf-pw-group">
        <label className="pf-pw-label">New Password</label>
        <div className={`pf-pw-input-wrap ${errors.next ? 'pf-pw-input-wrap--err' : ''}`}>
          <input
            type={show.next ? 'text' : 'password'}
            className="pf-pw-input"
            placeholder="Enter new password"
            value={form.next}
            onChange={(e) => setForm({ ...form, next: e.target.value })}
          />
          <button type="button" className="pf-pw-eye" onClick={() => setShow({ ...show, next: !show.next })}>
            <EyeIcon visible={show.next} />
          </button>
        </div>
        {form.next && (
          <div className="pf-strength">
            <div className="pf-strength-bars">
              {[1,2,3,4].map((n) => (
                <div
                  key={n}
                  className="pf-strength-bar"
                  style={{ background: n <= strength ? strengthColors[strength] : '#e5e7eb' }}
                />
              ))}
            </div>
            <span className="pf-strength-label" style={{ color: strengthColors[strength] }}>
              {strengthLabels[strength]}
            </span>
          </div>
        )}
        {errors.next && <p className="pf-pw-error">{errors.next}</p>}
      </div>

      {/* Confirm Password */}
      <div className="pf-pw-group">
        <label className="pf-pw-label">Confirm New Password</label>
        <div className={`pf-pw-input-wrap ${errors.confirm ? 'pf-pw-input-wrap--err' : ''}`}>
          <input
            type={show.confirm ? 'text' : 'password'}
            className="pf-pw-input"
            placeholder="Repeat new password"
            value={form.confirm}
            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
          />
          <button type="button" className="pf-pw-eye" onClick={() => setShow({ ...show, confirm: !show.confirm })}>
            <EyeIcon visible={show.confirm} />
          </button>
        </div>
        {form.confirm && form.next && form.confirm === form.next && (
          <p className="pf-pw-match">✅ Passwords match</p>
        )}
        {errors.confirm && <p className="pf-pw-error">{errors.confirm}</p>}
      </div>

      <button
        type="submit"
        className={`pf-btn pf-btn--primary ${loading ? 'pf-btn--loading' : ''}`}
        disabled={loading}
        style={{ marginTop: 8 }}
      >
        {loading ? (
          <span className="pf-spinner" />
        ) : '🔒 Update Password'}
      </button>
    </form>
  );
}

function SecurityModal({ onClose }) {
  const [twoFa, setTwoFa] = useState(true);
  const [biometric, setBiometric] = useState(false);
  const [showPwForm, setShowPwForm] = useState(false);

  if (showPwForm) {
    return (
      <Modal title="Security Settings" onClose={onClose}>
        <ChangePasswordForm onBack={() => setShowPwForm(false)} />
      </Modal>
    );
  }

  return (
    <Modal title="Security Settings" onClose={onClose}>
      <div className="pf-sec-list">
        <div className="pf-sec-item">
          <div className="pf-sec-info">
            <span className="pf-sec-icon">🔑</span>
            <div>
              <p className="pf-sec-label">Change Password</p>
              <p className="pf-sec-sub">Last changed 3 months ago</p>
            </div>
          </div>
          <button className="pf-btn pf-btn--sm" onClick={() => setShowPwForm(true)}>Change</button>
        </div>
        <div className="pf-sec-item">
          <div className="pf-sec-info">
            <span className="pf-sec-icon">📲</span>
            <div>
              <p className="pf-sec-label">Two-Factor Authentication</p>
              <p className="pf-sec-sub">Add an extra layer of security</p>
            </div>
          </div>
          <button className={`pf-toggle ${twoFa ? 'pf-toggle--on' : ''}`} onClick={() => setTwoFa(!twoFa)}>
            <span className="pf-toggle-knob" />
          </button>
        </div>
        <div className="pf-sec-item">
          <div className="pf-sec-info">
            <span className="pf-sec-icon">👆</span>
            <div>
              <p className="pf-sec-label">Biometric Login</p>
              <p className="pf-sec-sub">Use fingerprint or face ID</p>
            </div>
          </div>
          <button className={`pf-toggle ${biometric ? 'pf-toggle--on' : ''}`} onClick={() => setBiometric(!biometric)}>
            <span className="pf-toggle-knob" />
          </button>
        </div>
        <div className="pf-sec-item">
          <div className="pf-sec-info">
            <span className="pf-sec-icon">📜</span>
            <div>
              <p className="pf-sec-label">Active Sessions</p>
              <p className="pf-sec-sub">2 devices logged in</p>
            </div>
          </div>
          <button className="pf-btn pf-btn--sm pf-btn--danger-sm">Manage</button>
        </div>
      </div>
    </Modal>
  );
}

function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const profile = {
    name: user?.name || FALLBACK.name,
    email: user?.email || FALLBACK.email,
    phone: user?.phone || FALLBACK.phone,
    dob: user?.dob || FALLBACK.dob,
    gender: user?.gender || FALLBACK.gender,
    address: user?.address || FALLBACK.address,
    photo: user?.photo || FALLBACK.photo,
    membership: user?.membership || FALLBACK.membership,
    bloodType: user?.bloodType || FALLBACK.bloodType,
    weightKg: user?.weightKg ?? FALLBACK.weightKg,
    heightCm: user?.heightCm ?? FALLBACK.heightCm,
    healthScore: FALLBACK.healthScore,
    allergies: FALLBACK.allergies,
    conditions: FALLBACK.conditions,
    records: user?.records || FALLBACK.records,
    insurance: FALLBACK.insurance,
    payments: FALLBACK.payments,
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const accountLinks = [
    {
      id: 'personal', label: 'Personal Information', sub: 'Name, contact & address',
      color: '#4f46e5', bg: 'rgba(79,70,229,0.10)',
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="8" r="3.4" stroke="currentColor" strokeWidth="1.7" /><path d="M5 20c1.4-3.6 4.4-5.6 7-5.6s5.6 2 7 5.6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" /></svg>),
    },
    {
      id: 'medical', label: 'Medical Records', sub: 'Consultations, lab reports & prescriptions',
      color: '#059669', bg: 'rgba(5,150,105,0.10)',
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 3h9l5 5v13H6z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" /><path d="M9 12h6M9 16h6M15 3v5h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
    },
    {
      id: 'insurance', label: 'Insurance Details', sub: 'Policy, coverage & expiry',
      color: '#0891b2', bg: 'rgba(8,145,178,0.10)',
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l7 3v5c0 4.5-3 8-7 9-4-1-7-4.5-7-9V6l7-3z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" /><path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" /></svg>),
    },
    {
      id: 'payment', label: 'Payment Methods', sub: 'PhonePe, UPI & billing',
      color: '#d97706', bg: 'rgba(217,119,6,0.10)',
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.6" /><path d="M3 10h18M7 14h4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>),
    },
    {
      id: 'security', label: 'Security Settings', sub: 'Password, 2FA & sessions',
      color: '#dc2626', bg: 'rgba(220,38,38,0.10)',
      icon: (<svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="5" y="10" width="14" height="10" rx="2" stroke="currentColor" strokeWidth="1.7" /><path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.7" /><circle cx="12" cy="15" r="1.5" fill="currentColor" /></svg>),
    },
  ];

  const stats = [
    { label: 'Blood Type', value: profile.bloodType, color: '#e11d48', bg: 'rgba(225,29,72,0.10)', emoji: '🩸' },
    { label: 'Weight', value: `${profile.weightKg} kg`, color: '#0d9488', bg: 'rgba(13,148,136,0.10)', emoji: '⚖️' },
    { label: 'Height', value: `${profile.heightCm} cm`, color: '#2563eb', bg: 'rgba(37,99,235,0.10)', emoji: '📏' },
    { label: 'Health Score', value: `${profile.healthScore}`, color: '#7c3aed', bg: 'rgba(124,58,237,0.10)', emoji: '💚' },
  ];

  return (
    <PatientLayout>
      {/* Hero Header */}
      <div className="pf-hero">
        <div className="pf-hero-bg" />
        <div className="pf-hero-content">
          <div className="pf-avatar-wrap">
            {profile.photo ? (
              <img src={profile.photo} alt={profile.name} className="pf-avatar" />
            ) : (
              <div className="pf-avatar pf-avatar--placeholder">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="8" r="4" fill="rgba(255,255,255,0.6)" />
                  <path d="M4 20c1.6-4 4.8-6.5 8-6.5s6.4 2.5 8 6.5" stroke="rgba(255,255,255,0.6)" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
            )}
            <button className="pf-avatar-edit" title="Change photo">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h4M16 17l5-5-5-5M21 12H9" stroke="white" strokeWidth="2" strokeLinecap="round" />
                <path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="pf-verified">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </div>
          <h2 className="pf-name">{profile.name}</h2>
          <p className="pf-email-sub">{profile.email}</p>
          <span className="pf-membership">⭐ {profile.membership}</span>
        </div>
      </div>

      {/* Health Score Bar */}
      <div className="pf-health-score-wrap">
        <div className="pf-health-score-header">
          <span className="pf-hs-label">Overall Health Score</span>
          <span className="pf-hs-value">{profile.healthScore}/100</span>
        </div>
        <div className="pf-hs-bar-bg">
          <div className="pf-hs-bar" style={{ width: `${profile.healthScore}%` }} />
        </div>
        <p className="pf-hs-note">🟢 Excellent · Based on recent checkups</p>
      </div>

      {/* Stats Grid */}
      <div className="pf-stats-grid">
        {stats.map((s) => (
          <div className="pf-stat-tile" key={s.label} style={{ '--tile-color': s.color, '--tile-bg': s.bg }}>
            <span className="pf-tile-emoji">{s.emoji}</span>
            <p className="pf-tile-value">{s.value}</p>
            <p className="pf-tile-label">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Account Details */}
      <p className="pf-section-label">Account Details</p>
      <div className="pf-account-card">
        {accountLinks.map((link) => (
          <button key={link.id} type="button" className="pf-account-row" onClick={() => setActiveModal(link.id)}>
            <span className="pf-account-icon" style={{ background: link.bg, color: link.color }}>
              {link.icon}
            </span>
            <div className="pf-account-texts">
              <span className="pf-account-text">{link.label}</span>
              <span className="pf-account-sub">{link.sub}</span>
            </div>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" className="pf-account-chevron">
              <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        ))}
      </div>

      {/* Logout */}
      <button type="button" className="pf-logout" onClick={handleLogout}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M9 3H5a2 2 0 00-2 2v14a2 2 0 002 2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Sign Out
      </button>

      {/* Modals */}
      {activeModal === 'personal'  && <PersonalInfoModal   profile={profile} onClose={() => setActiveModal(null)} />}
      {activeModal === 'medical'   && <MedicalRecordsModal profile={profile} onClose={() => setActiveModal(null)} />}
      {activeModal === 'insurance' && <InsuranceModal      profile={profile} onClose={() => setActiveModal(null)} />}
      {activeModal === 'payment'   && <PaymentModal          profile={profile} onClose={() => setActiveModal(null)} />}
      {activeModal === 'security'  && <SecurityModal                           onClose={() => setActiveModal(null)} />}
    </PatientLayout>
  );
}

export default Profile;