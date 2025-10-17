export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string; // hashed
  roleId: string;
  phoneNumber?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}