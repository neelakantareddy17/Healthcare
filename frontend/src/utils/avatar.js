export const AVATAR_OPTIONS = [
  { id: 'sage', label: 'Sage', background: '#D9F0E8', color: '#176B5F' },
  { id: 'ocean', label: 'Ocean', background: '#DCEBFA', color: '#245A87' },
  { id: 'coral', label: 'Coral', background: '#FCE1D8', color: '#A64B3A' },
  { id: 'lavender', label: 'Lavender', background: '#EAE2F8', color: '#654E91' },
  { id: 'sunrise', label: 'Sunrise', background: '#FBEBCB', color: '#91621E' },
];

export const getAvatarOption = (avatarId) => AVATAR_OPTIONS.find((avatar) => avatar.id === avatarId);
