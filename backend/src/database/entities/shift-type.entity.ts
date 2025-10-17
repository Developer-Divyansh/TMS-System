export interface ShiftType {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  breakDuration: number; // in minutes
  color: string;
  isActive: boolean;
}