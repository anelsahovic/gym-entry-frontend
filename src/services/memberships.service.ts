import API from './axios';

export const getMemberships = async () => {
  return await API.get('/memberships');
};
