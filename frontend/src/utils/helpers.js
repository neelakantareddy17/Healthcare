export const generateToken = () => Math.floor(100 + Math.random() * 900);

export const getInitials = (name = '') =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const capitalize = (str = '') =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const sleep = (ms) => new Promise((res) => setTimeout(res, ms));
