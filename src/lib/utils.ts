import { clsx, type ClassValue } from 'clsx';
import { isBefore } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getMembershipStatus(endDate: Date) {
  const currentDate = new Date();

  const status = isBefore(currentDate, endDate) ? 'Active' : 'Expired';
  return status;
}

export function getMembershipBadgeColor(membership: string) {
  const membershipIdNormalized = membership.trim().toLowerCase();
  return membershipIdNormalized === 'daily'
    ? 'bg-sky-400'
    : membershipIdNormalized === 'monthly'
    ? 'bg-violet-400'
    : membershipIdNormalized === 'yearly'
    ? 'bg-yellow-500'
    : membershipIdNormalized === 'half year'
    ? 'bg-orange-500'
    : 'bg-gradient-to-br from-teal-400 via-pink-400 to-amber-400';
}
