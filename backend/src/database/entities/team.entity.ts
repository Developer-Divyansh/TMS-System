export interface Team {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}