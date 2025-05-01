import { CreateMemberBody, UpdateMemberBody } from '@/schemas/zod.schemas';
import API from './axios';

export const getMembers = async () => {
  return await API.get('/members');
};

export const getMemberById = async (memberId: string) => {
  return await API.get(`/members/${memberId}`);
};

export const createMember = async (member: CreateMemberBody) => {
  return await API.post('/members', member);
};

export const updateMember = async (
  memberId: string,
  member: UpdateMemberBody
) => {
  return API.put(`/members/${memberId}`, member);
};

export const deleteMember = async (memberId: string) => {
  return API.delete(`/members/${memberId}`);
};
