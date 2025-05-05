import {
  ChangeUserPasswordBody,
  CreateUserBody,
  ResetUserPasswordBody,
  UpdateUserBody,
} from '@/schemas/zod.schemas';
import API from './axios';

export const getUsers = async () => {
  return API.get('/users');
};

export const getUserById = async (id: string) => {
  return API.get(`/users/${id}`);
};

export const createUser = async (user: CreateUserBody) => {
  return API.post('/users', user);
};

export const updateUser = async (userId: string, user: UpdateUserBody) => {
  return API.put(`/users/${userId}`, user);
};

export const updateUserPassword = async (
  userId: string,
  values: ChangeUserPasswordBody
) => {
  return API.patch(`/users/${userId}/update-password`, values);
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
