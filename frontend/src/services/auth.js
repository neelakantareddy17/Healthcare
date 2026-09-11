import api from './api';
import { setToken, setUser, removeToken, removeUser } from '../utils/token';

export const login = async (email, password) => {
  const response = await api.post('/auth/login', {
    email,
    password,
  });

  const { user, token } = response.data.data;

  setToken(token);
  setUser(user);

  return { user, token };
};

export const register = async (data) => {
  const response = await api.post('/auth/register', data);

  const { user, token } = response.data.data;

  setToken(token);
  setUser(user);

  return { user, token };
};

export const getMe = async () => {
  const response = await api.get('/auth/me');

  const user = response.data.data;

  setUser(user);

  return user;
};

export const logout = () => {
  removeToken();
  removeUser();
};