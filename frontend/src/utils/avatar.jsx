/**
 * MediQ AI — Patient Avatar System
 *
 * Backend limitation: the User and Patient Prisma models have no avatar field.
 * We persist the avatar identifier in localStorage keyed by userId so it
 * survives page refreshes without requiring a backend change.
 *
 * avatarId values: 'av1' … 'av8'  |  null / '' = no selection (show initials)
 */

import { useState, useEffect } from 'react';

// ── Storage helpers ─────────────────────────────────────────────────────────

const storageKey = (userId) => `mediq_avatar_${userId}`;

export const saveAvatarId = (userId, avatarId) => {
  if (!userId) return;
  if (avatarId) {
    localStorage.setItem(storageKey(userId), avatarId);
  } else {
    localStorage.removeItem(storageKey(userId));
  }
  try {
    window.dispatchEvent(
      new CustomEvent('mediq:avatar-changed', {
        detail: { userId, avatarId: avatarId || null },
      })
    );
  } catch {
    // ignore in non-browser environments
  }
};

export const loadAvatarId = (userId) => {
  if (!userId) return null;
  return localStorage.getItem(storageKey(userId)) || null;
};

/**
 * Hook to reactively track a patient's chosen avatar.
 * Auto-updates when changed in Personal Information or Registration.
 */
export const usePatientAvatar = (userId) => {
  const [avatarId, setAvatarId] = useState(() => loadAvatarId(userId));

  useEffect(() => {
    setAvatarId(loadAvatarId(userId));

    const handleUpdate = (e) => {
      if (!userId || e.detail?.userId === userId) {
        setAvatarId(e.detail?.avatarId ?? loadAvatarId(userId));
      }
    };

    const handleStorage = (e) => {
      if (e.key === storageKey(userId)) {
        setAvatarId(e.newValue || null);
      }
    };

    window.addEventListener('mediq:avatar-changed', handleUpdate);
    window.addEventListener('storage', handleStorage);
    return () => {
      window.removeEventListener('mediq:avatar-changed', handleUpdate);
      window.removeEventListener('storage', handleStorage);
    };
  }, [userId]);

  return avatarId;
};

// ── Avatar catalogue ─────────────────────────────────────────────────────────
// Each entry is a pure-SVG illustration with an accessibility label.
// Colours are drawn from the MediQ design palette.

export const AVATARS = [
  {
    id: 'av1',
    label: 'Person with short hair',
    bgColor: '#e8f5f3',
    accentColor: '#0d6e64',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="36" cy="36" r="36" fill="#e8f5f3" />
        {/* Body */}
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#0d6e64" opacity="0.18" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#0d6e64" />
        {/* Head */}
        <circle cx="36" cy="30" r="12" fill="#f9d5b0" />
        {/* Hair */}
        <path d="M24 28c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="#2d1a0e" />
        {/* Face features */}
        <circle cx="32" cy="30" r="1.2" fill="#5a3e2b" />
        <circle cx="40" cy="30" r="1.2" fill="#5a3e2b" />
        <path d="M33 34.5q3 2.5 6 0" stroke="#c07a5a" strokeWidth="1.2" strokeLinecap="round" />
        {/* Stethoscope hint */}
        <path d="M28 52q0-4 8-4t8 4" stroke="white" strokeWidth="1.4" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'av2',
    label: 'Person with long hair',
    bgColor: '#eef2ff',
    accentColor: '#3b5cd6',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="#eef2ff" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#3b5cd6" />
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#3b5cd6" opacity="0.18" />
        <circle cx="36" cy="30" r="12" fill="#f9d5b0" />
        {/* Long hair */}
        <path d="M24 30c0-6.6 5.4-14 12-14s12 7.4 12 14" fill="#6b3a2a" />
        <rect x="24" y="30" width="3" height="12" rx="1.5" fill="#6b3a2a" />
        <rect x="45" y="30" width="3" height="12" rx="1.5" fill="#6b3a2a" />
        <circle cx="32" cy="30" r="1.2" fill="#5a3e2b" />
        <circle cx="40" cy="30" r="1.2" fill="#5a3e2b" />
        <path d="M33 34.5q3 2.5 6 0" stroke="#c07a5a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'av3',
    label: 'Person with curly hair',
    bgColor: '#fff3e8',
    accentColor: '#d6455a',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="#fff3e8" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#d6455a" />
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#d6455a" opacity="0.18" />
        <circle cx="36" cy="30" r="12" fill="#f5c5a0" />
        {/* Curly hair */}
        <circle cx="30" cy="22" r="5" fill="#1a1a1a" />
        <circle cx="36" cy="20" r="5" fill="#1a1a1a" />
        <circle cx="42" cy="22" r="5" fill="#1a1a1a" />
        <circle cx="27" cy="26" r="4" fill="#1a1a1a" />
        <circle cx="45" cy="26" r="4" fill="#1a1a1a" />
        <circle cx="32" cy="30" r="1.2" fill="#5a3e2b" />
        <circle cx="40" cy="30" r="1.2" fill="#5a3e2b" />
        <path d="M33 34.5q3 2 6 0" stroke="#c07a5a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'av4',
    label: 'Person with beard',
    bgColor: '#f0faf8',
    accentColor: '#0a8a78',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="#f0faf8" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#0a8a78" />
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#0a8a78" opacity="0.18" />
        <circle cx="36" cy="30" r="12" fill="#e8b88a" />
        {/* Beard */}
        <path d="M25 32c0 8 4 12 11 12s11-4 11-12" fill="#4a3020" />
        {/* Hair */}
        <path d="M24 26c0-6.6 5.4-10 12-10s12 3.4 12 10" fill="#2a1a0a" />
        <circle cx="32" cy="29" r="1.3" fill="#3a2518" />
        <circle cx="40" cy="29" r="1.3" fill="#3a2518" />
      </svg>
    ),
  },
  {
    id: 'av5',
    label: 'Person with hijab',
    bgColor: '#f3e8ff',
    accentColor: '#7c3aed',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="#f3e8ff" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#7c3aed" />
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#7c3aed" opacity="0.18" />
        {/* Hijab */}
        <ellipse cx="36" cy="28" rx="15" ry="14" fill="#7c3aed" opacity="0.85" />
        <circle cx="36" cy="30" r="10" fill="#f5c5a0" />
        {/* Hijab bottom */}
        <path d="M22 34c0 6 4 10 14 12V34H22z" fill="#7c3aed" opacity="0.85" />
        <path d="M50 34c0 6-4 10-14 12V34H50z" fill="#7c3aed" opacity="0.85" />
        <circle cx="32.5" cy="30" r="1.2" fill="#5a3e2b" />
        <circle cx="39.5" cy="30" r="1.2" fill="#5a3e2b" />
        <path d="M34 34.5q2 1.5 4 0" stroke="#c07a5a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'av6',
    label: 'Person with glasses',
    bgColor: '#ecfdf5',
    accentColor: '#059669',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="#ecfdf5" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#059669" />
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#059669" opacity="0.18" />
        <circle cx="36" cy="30" r="12" fill="#f9d5b0" />
        {/* Hair */}
        <path d="M24 28c0-6 5.4-12 12-12s12 6 12 12" fill="#444" />
        {/* Glasses */}
        <circle cx="31.5" cy="30" r="4.5" stroke="#2d2d2d" strokeWidth="1.5" fill="none" />
        <circle cx="40.5" cy="30" r="4.5" stroke="#2d2d2d" strokeWidth="1.5" fill="none" />
        <line x1="36" y1="30" x2="36" y2="30" stroke="#2d2d2d" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M36 30h0" stroke="#2d2d2d" strokeWidth="1.5" />
        <path d="M27 30h-3M45 30h3" stroke="#2d2d2d" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="31.5" cy="30" r="1.2" fill="#5a3e2b" />
        <circle cx="40.5" cy="30" r="1.2" fill="#5a3e2b" />
        <path d="M33 34.5q3 2 6 0" stroke="#c07a5a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    id: 'av7',
    label: 'Elderly person',
    bgColor: '#fef9e8',
    accentColor: '#d97706',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="#fef9e8" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#d97706" />
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#d97706" opacity="0.18" />
        <circle cx="36" cy="30" r="12" fill="#f0c8a0" />
        {/* White/grey hair */}
        <path d="M24 28c0-6.6 5.4-12 12-12s12 5.4 12 12" fill="#c8c8c8" />
        <circle cx="32" cy="30" r="1.2" fill="#5a3e2b" />
        <circle cx="40" cy="30" r="1.2" fill="#5a3e2b" />
        <path d="M33 34.5q3 1.5 6 0" stroke="#b07050" strokeWidth="1.2" strokeLinecap="round" />
        {/* Wrinkle lines */}
        <path d="M28 28q2-1 4 0M40 28q2-1 4 0" stroke="#d4a070" strokeWidth="0.8" strokeLinecap="round" opacity="0.6" />
      </svg>
    ),
  },
  {
    id: 'av8',
    label: 'Person with hat',
    bgColor: '#fce8ea',
    accentColor: '#be3a50',
    svg: (size = 72) => (
      <svg width={size} height={size} viewBox="0 0 72 72" fill="none">
        <circle cx="36" cy="36" r="36" fill="#fce8ea" />
        <rect x="23" y="44" width="26" height="16" rx="6" fill="#be3a50" />
        <ellipse cx="36" cy="58" rx="17" ry="10" fill="#be3a50" opacity="0.18" />
        <circle cx="36" cy="31" r="12" fill="#f9d5b0" />
        {/* Hat brim */}
        <rect x="22" y="23" width="28" height="4" rx="2" fill="#be3a50" />
        {/* Hat top */}
        <rect x="27" y="12" width="18" height="13" rx="3" fill="#be3a50" />
        {/* Hat band */}
        <rect x="27" y="20" width="18" height="3" rx="0" fill="#8a1a2a" />
        <circle cx="32" cy="31" r="1.2" fill="#5a3e2b" />
        <circle cx="40" cy="31" r="1.2" fill="#5a3e2b" />
        <path d="M33 35.5q3 2 6 0" stroke="#c07a5a" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
    ),
  },
];

// Quick lookup by id
export const getAvatarById = (id) => AVATARS.find((a) => a.id === id) ?? null;

// ── Initials helper ───────────────────────────────────────────────────────────
// Returns up to 2 uppercase initials from a display name.
export const getInitials = (name = '') => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

// Deterministic pastel bg based on name (for initials fallback)
const PALETTE = [
  { bg: '#e8f5f3', fg: '#0d6e64' },
  { bg: '#eef2ff', fg: '#3b5cd6' },
  { bg: '#fff3e8', fg: '#d6455a' },
  { bg: '#f3e8ff', fg: '#7c3aed' },
  { bg: '#ecfdf5', fg: '#059669' },
  { bg: '#fef9e8', fg: '#d97706' },
];

export const getInitialsColor = (name = '') => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
};
