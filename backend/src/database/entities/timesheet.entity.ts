export interface Timesheet {
  id: string;
  userId: string;
  shiftId: string;
  workDate: string; // YYYY-MM-DD format
  clockIn?: Date;
  clockOut?: Date;
  breakDuration: number; // in minutes
  regularHours: number;
  overtimeHours: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}