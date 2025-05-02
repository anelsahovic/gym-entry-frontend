import API from './axios';

export const getUsers = async () => {
  return API.get('/users');
};
