export const setToken = (token) => localStorage.setItem('mediq_token', token);
export const getToken = () => localStorage.getItem('mediq_token');
export const removeToken = () => localStorage.removeItem('mediq_token');

export const setUser = (user) => localStorage.setItem('mediq_user', JSON.stringify(user));
export const getUser = () => {
  const u = localStorage.getItem('mediq_user');
  return u ? JSON.parse(u) : null;
};
export const removeUser = () => localStorage.removeItem('mediq_user');
