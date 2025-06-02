import axiosInstance from './axiosConfig';

export const register = async ({ name, email, password, role }) => {
  const response = await axiosInstance.post('/api/auth/register', {
    name,
    email,
    password,
    role,
  });
  return response.data;
};

export const login = async ({ email, password }) => {
  const response = await axiosInstance.post('/api/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const checkAuth = async () => {
  const response = await axiosInstance.get('/api/protected');
  return response.data;
};