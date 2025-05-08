import API from './axios';
import {
  CreateMembershipBody,
  UpdateMembershipBody,
} from '@/schemas/zod.schemas';

export const getMemberships = async () => {
  return await API.get('/memberships');
};

export const createMembership = async (membership: CreateMembershipBody) => {
  return await API.post('/memberships', membership);
};

export const updateMembership = async (
  membershipId: string,
  membership: UpdateMembershipBody
) => {
  return API.put(`/memberships/${membershipId}`, membership);
};

export const deleteMembership = async (membershipId: string) => {
  return API.delete(`/memberships/${membershipId}`);
};
