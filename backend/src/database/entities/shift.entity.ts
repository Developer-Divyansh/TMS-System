export interface Shift {
  id: string;
  userId: string;
  teamId: string;
  shiftTypeId: string;
  shiftDate: string; // YYYY-MM-DD format
  actualStartTime?: Date;
  actualEndTime?: Date;
  actualBreakDuration?: number; // in minutes
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}