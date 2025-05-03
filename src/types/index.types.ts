export interface Member {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  uniqueId: string;
  membership: {
    name: string;
  };
  createdBy: {
    name: string;
  };
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;

  staffId: string;
  membershipId: string;
}

export interface Membership {
  id: string;
  name: string;
  durationDays: number;
  price: number;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'STAFF';
  createdAt: Date;
}
