// User types
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  teams?: Team[];
  phoneNumber?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: string[];
  createdAt: string;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  managerId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface UserTeam {
  userId: string;
  teamId: string;
  joinedAt: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

// Shift types
export interface ShiftType {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  breakDuration: number;
  color: string;
  isActive: boolean;
}

export interface Shift {
  id: string;
  userId: string;
  user?: User;
  teamId: string;
  team?: Team;
  shiftType: ShiftType;
  shiftDate: string;
  actualStartTime?: string;
  actualEndTime?: string;
  actualBreakDuration?: number;
  status: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShiftData {
  userId: string;
  teamId: string;
  shiftTypeId: string;
  shiftDate: string;
  notes?: string;
}

export interface UpdateShiftData {
  userId?: string;
  teamId?: string;
  shiftTypeId?: string;
  shiftDate?: string;
  actualStartTime?: string;
  actualEndTime?: string;
  actualBreakDuration?: number;
  status?: 'scheduled' | 'in_progress' | 'completed' | 'missed';
  notes?: string;
}

// Timesheet types
export interface Timesheet {
  id: string;
  userId: string;
  user?: User;
  shiftId: string;
  shift?: Shift;
  workDate: string;
  clockIn?: string;
  clockOut?: string;
  breakDuration: number;
  regularHours: number;
  overtimeHours: number;
  status: 'pending' | 'submitted' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimesheetData {
  shiftId: string;
  workDate: string;
  clockIn?: string;
  clockOut?: string;
  breakDuration: number;
  notes?: string;
}

export interface UpdateTimesheetData {
  clockIn?: string;
  clockOut?: string;
  breakDuration?: number;
  regularHours?: number;
  overtimeHours?: number;
  status?: 'pending' | 'submitted' | 'approved' | 'rejected';
  notes?: string;
}

export interface ApproveTimesheetData {
  approved: boolean;
  notes?: string;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  scheduledAt?: string;
  sentAt?: string;
  createdAt: string;
}

export interface CreateNotificationData {
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  scheduledAt?: string;
}

// API response types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    message: string;
    status: number;
    details?: any;
  };
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    items: T[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

// Query parameter types
export interface QueryParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  [key: string]: any;
}

export interface UserQueryParams extends QueryParams {
  teamId?: string;
  isActive?: boolean;
  roleId?: string;
}

export interface ShiftQueryParams extends QueryParams {
  startDate?: string;
  endDate?: string;
  userId?: string;
  teamId?: string;
  status?: string;
}

export interface TimesheetQueryParams extends QueryParams {
  startDate?: string;
  endDate?: string;
  userId?: string;
  status?: string;
}

export interface NotificationQueryParams extends QueryParams {
  isRead?: boolean;
  type?: string;
}