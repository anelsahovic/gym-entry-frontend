import {
  CreateUserBody,
  ResetUserPasswordBody,
  UpdateUserBody,
} from '@/schemas/zod.schemas';
import API from './axios';

export const getUsers = async () => {
  return API.get('/users');
};

export const createUser = async (user: CreateUserBody) => {
  return API.post('/users', user);
};

export const updateUser = async (userId: string, user: UpdateUserBody) => {
  return API.put(`/users/${userId}`, user);
};

export const resetUserPassword = async (
  userId: string,
  values: ResetUserPasswordBody
) => {
  return API.patch(`/users/${userId}/reset-password`, values);
};

export const deleteUser = async (userId: string) => {
  return API.delete(`/users/${userId}`);
};
