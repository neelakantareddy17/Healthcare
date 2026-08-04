import { sleep } from '../utils/helpers';
import { setToken, setUser, removeToken, removeUser } from '../utils/token';

const MOCK_USERS = [
  { id: 1, name: 'Arjun Sharma', email: 'patient@demo.com', password: 'demo123', role: 'patient', phone: '+91 9876543210', avatar: null },
  { id: 2, name: 'Dr. Priya Nair', email: 'doctor@demo.com', password: 'demo123', role: 'doctor', specialty: 'Cardiologist', phone: '+91 9876543211', avatar: null },
  { id: 3, name: 'Admin User', email: 'admin@demo.com', password: 'demo123', role: 'admin', phone: '+91 9876543212', avatar: null },
];

export const login = async (email, password) => {
  await sleep(800);
  const user = MOCK_USERS.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error('Invalid credentials');
  const { password: _, ...safeUser } = user;
  const token = `mock_token_${user.id}_${Date.now()}`;
  setToken(token);
  setUser(safeUser);
  return { user: safeUser, token };
};

export const register = async (data) => {
  await sleep(800);
  const exists = MOCK_USERS.find((u) => u.email === data.email);
  if (exists) throw new Error('Email already registered');
  const newUser = { id: Date.now(), ...data, role: 'patient', avatar: null };
  const { password: _, ...safeUser } = newUser;
  const token = `mock_token_${newUser.id}_${Date.now()}`;
  setToken(token);
  setUser(safeUser);
  return { user: safeUser, token };
};

export const logout = () => {
  removeToken();
  removeUser();
};
