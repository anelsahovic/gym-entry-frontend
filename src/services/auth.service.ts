import API from './axios';

export const login = async (username: string, password: string) => {
  const response = await API.post('/auth/login', { username, password });
  return response;
};

export const logout = async () => {
  const response = await API.post('/auth/logout');
  return response;
};
