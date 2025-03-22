export enum UserRole {
  USER = 'user',
  ADMIN = 'admin',
  AGENT = 'agent',
}

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  role: UserRole;
  address?: string;
  profileImage?: string;
  verificationImage?: string;
  isVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}