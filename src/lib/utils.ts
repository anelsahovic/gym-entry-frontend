import { Member, Membership } from '@/types/index.types';
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

export function getRoleBadgeColor(role: string) {
  const roleIdNormalized = role.trim().toLowerCase();
  return roleIdNormalized === 'admin'
    ? 'bg-gradient-to-br from-red-500 via-orange-500 to-yellow-400'
    : roleIdNormalized === 'staff'
    ? 'bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-500'
    : 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-400';
}

type RevenueData = { month: string; revenue: number };

export function getLastThreeMonthsRevenue(
  members: Member[],
  memberships: Membership[]
): RevenueData[] {
  // Helper: get month name from Date
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  // Get current date, and last 3 months including current month
  const now = new Date();
  const months = [];
  for (let i = 2; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ year: d.getFullYear(), month: d.getMonth() });
  }

  // Map memberships by id for quick lookup
  const membershipMap = new Map(memberships.map((m) => [m.id, m]));

  // Initialize revenue accumulator per month (key: 'YYYY-MM')
  const revenueByMonth = new Map<string, number>();

  // Initialize revenue keys to zero
  months.forEach(({ year, month }) => {
    const key = `${year}-${month}`;
    revenueByMonth.set(key, 0);
  });

  // Calculate revenue by summing membership prices of members who started in the month
  members.forEach((member) => {
    const startDate = new Date(member.startDate);
    const key = `${startDate.getFullYear()}-${startDate.getMonth()}`;
    if (revenueByMonth.has(key)) {
      const membership = membershipMap.get(member.membershipId);
      if (membership) {
        revenueByMonth.set(
          key,
          (revenueByMonth.get(key) ?? 0) + membership.price
        );
      }
    }
  });

  // Build result array with month name and revenue
  const result: RevenueData[] = months.map(({ year, month }) => {
    const key = `${year}-${month}`;
    return {
      month: monthNames[month],
      revenue: revenueByMonth.get(key) ?? 0,
    };
  });

  return result;
}
