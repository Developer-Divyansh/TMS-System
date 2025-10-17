import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MockDatabaseService } from '../database/mock-database.service';

@Injectable()
export class TimesheetsService {
  constructor(private readonly databaseService: MockDatabaseService) {}

  async findAll(query: any) {
    const { startDate, endDate, userId, status } = query;
    
    let timesheets = this.databaseService.getAllTimesheets();
    
    // Filter by date range
    if (startDate) {
      timesheets = timesheets.filter(timesheet => timesheet.workDate >= startDate);
    }
    if (endDate) {
      timesheets = timesheets.filter(timesheet => timesheet.workDate <= endDate);
    }
    
    // Filter by user
    if (userId) {
      timesheets = timesheets.filter(timesheet => timesheet.userId === userId);
    }
    
    // Filter by status
    if (status) {
      timesheets = timesheets.filter(timesheet => timesheet.status === status);
    }
    
    // Get detailed information for each timesheet
    const timesheetsWithDetails = timesheets.map(timesheet => {
      const user = this.databaseService.getUserById(timesheet.userId);
      const shift = this.databaseService.getShiftById(timesheet.shiftId);
      const approvedBy = timesheet.approvedBy 
        ? this.databaseService.getUserById(timesheet.approvedBy)
        : null;
      
      return {
        id: timesheet.id,
        userId: timesheet.userId,
        user: user ? {
          firstName: user.firstName,
          lastName: user.lastName,
        } : null,
        shiftId: timesheet.shiftId,
        shift: shift ? {
          shiftDate: shift.shiftDate,
          shiftType: this.databaseService.getShiftTypeById(shift.shiftTypeId),
        } : null,
        workDate: timesheet.workDate,
        clockIn: timesheet.clockIn,
        clockOut: timesheet.clockOut,
        breakDuration: timesheet.breakDuration,
        regularHours: timesheet.regularHours,
        overtimeHours: timesheet.overtimeHours,
        status: timesheet.status,
        approvedBy: approvedBy ? {
          firstName: approvedBy.firstName,
          lastName: approvedBy.lastName,
        } : null,
        approvedAt: timesheet.approvedAt,
        notes: timesheet.notes,
        createdAt: timesheet.createdAt,
        updatedAt: timesheet.updatedAt,
      };
    });
    
    return {
      success: true,
      data: {
        timesheets: timesheetsWithDetails,
      },
    };
  }

  async findById(id: string) {
    const timesheet = this.databaseService.getTimesheetById(id);
    
    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }
    
    const user = this.databaseService.getUserById(timesheet.userId);
    const shift = this.databaseService.getShiftById(timesheet.shiftId);
    const approvedBy = timesheet.approvedBy 
      ? this.databaseService.getUserById(timesheet.approvedBy)
      : null;
    
    return {
      success: true,
      data: {
        id: timesheet.id,
        userId: timesheet.userId,
        user: user ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        } : null,
        shiftId: timesheet.shiftId,
        shift: shift ? {
          shiftDate: shift.shiftDate,
          shiftType: this.databaseService.getShiftTypeById(shift.shiftTypeId),
        } : null,
        workDate: timesheet.workDate,
        clockIn: timesheet.clockIn,
        clockOut: timesheet.clockOut,
        breakDuration: timesheet.breakDuration,
        regularHours: timesheet.regularHours,
        overtimeHours: timesheet.overtimeHours,
        status: timesheet.status,
        approvedBy: approvedBy ? {
          firstName: approvedBy.firstName,
          lastName: approvedBy.lastName,
          email: approvedBy.email,
        } : null,
        approvedAt: timesheet.approvedAt,
        notes: timesheet.notes,
        createdAt: timesheet.createdAt,
        updatedAt: timesheet.updatedAt,
      },
    };
  }

  async create(timesheetData: any, userId: string) {
    // Validate user exists
    const user = this.databaseService.getUserById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    // Validate shift exists
    const shift = this.databaseService.getShiftById(timesheetData.shiftId);
    if (!shift) {
      throw new BadRequestException('Shift not found');
    }
    
    // Check if shift belongs to the user
    if (shift.userId !== userId) {
      throw new BadRequestException('Shift does not belong to this user');
    }
    
    // Calculate hours worked
    const { regularHours, overtimeHours } = this.calculateHours(
      timesheetData.clockIn,
      timesheetData.clockOut,
      timesheetData.breakDuration || 0
    );
    
    const timesheet = this.databaseService.createTimesheet({
      userId: userId,
      shiftId: timesheetData.shiftId,
      workDate: timesheetData.workDate,
      clockIn: timesheetData.clockIn,
      clockOut: timesheetData.clockOut,
      breakDuration: timesheetData.breakDuration || 0,
      regularHours,
      overtimeHours,
      status: 'submitted',
      notes: timesheetData.notes || '',
    });
    
    return {
      success: true,
      data: {
        id: timesheet.id,
        regularHours: timesheet.regularHours,
        overtimeHours: timesheet.overtimeHours,
        status: timesheet.status,
        createdAt: timesheet.createdAt,
      },
    };
  }

  async update(id: string, updateData: any) {
    const timesheet = this.databaseService.getTimesheetById(id);
    
    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }
    
    // Only allow updates if timesheet is not approved yet
    if (timesheet.status === 'approved') {
      throw new BadRequestException('Cannot update approved timesheet');
    }
    
    // Recalculate hours if time data is being updated
    if (updateData.clockIn || updateData.clockOut || updateData.breakDuration !== undefined) {
      const clockIn = updateData.clockIn || timesheet.clockIn;
      const clockOut = updateData.clockOut || timesheet.clockOut;
      const breakDuration = updateData.breakDuration !== undefined 
        ? updateData.breakDuration 
        : timesheet.breakDuration;
      
      const { regularHours, overtimeHours } = this.calculateHours(
        clockIn,
        clockOut,
        breakDuration
      );
      
      updateData.regularHours = regularHours;
      updateData.overtimeHours = overtimeHours;
    }
    
    const updatedTimesheet = this.databaseService.updateTimesheet(id, updateData);
    
    return {
      success: true,
      data: {
        id: updatedTimesheet.id,
        regularHours: updatedTimesheet.regularHours,
        overtimeHours: updatedTimesheet.overtimeHours,
        updatedAt: updatedTimesheet.updatedAt,
      },
    };
  }

  async approve(id: string, approvedById: string, approved: boolean, notes?: string) {
    const timesheet = this.databaseService.getTimesheetById(id);
    
    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }
    
    // Check if timesheet can be approved/rejected
    if (timesheet.status !== 'submitted' && timesheet.status !== 'rejected') {
      throw new BadRequestException('Timesheet cannot be approved/rejected in current status');
    }
    
    // Validate approver exists
    const approver = this.databaseService.getUserById(approvedById);
    if (!approver) {
      throw new BadRequestException('Approver not found');
    }
    
    const updatedTimesheet = this.databaseService.updateTimesheet(id, {
      status: approved ? 'approved' : 'rejected',
      approvedBy: approvedById,
      approvedAt: new Date(),
      notes: notes || timesheet.notes,
    });
    
    return {
      success: true,
      data: {
        id: updatedTimesheet.id,
        status: updatedTimesheet.status,
        approvedBy: updatedTimesheet.approvedBy,
        approvedAt: updatedTimesheet.approvedAt,
        notes: updatedTimesheet.notes,
      },
    };
  }

  async remove(id: string) {
    const timesheet = this.databaseService.getTimesheetById(id);
    
    if (!timesheet) {
      throw new NotFoundException('Timesheet not found');
    }
    
    // Only allow deletion if timesheet is not approved yet
    if (timesheet.status === 'approved') {
      throw new BadRequestException('Cannot delete approved timesheet');
    }
    
    this.databaseService.deleteTimesheet(id);
    
    return {
      success: true,
      message: 'Timesheet deleted successfully',
    };
  }

  async getTimesheetsByUser(userId: string, startDate?: string, endDate?: string) {
    let timesheets = this.databaseService.getTimesheetsByUser(userId);
    
    // Filter by date range
    if (startDate) {
      timesheets = timesheets.filter(timesheet => timesheet.workDate >= startDate);
    }
    if (endDate) {
      timesheets = timesheets.filter(timesheet => timesheet.workDate <= endDate);
    }
    
    const timesheetsWithDetails = timesheets.map(timesheet => {
      const shift = this.databaseService.getShiftById(timesheet.shiftId);
      return {
        id: timesheet.id,
        workDate: timesheet.workDate,
        shift: shift ? {
          shiftDate: shift.shiftDate,
          shiftType: this.databaseService.getShiftTypeById(shift.shiftTypeId),
        } : null,
        regularHours: timesheet.regularHours,
        overtimeHours: timesheet.overtimeHours,
        status: timesheet.status,
        approvedAt: timesheet.approvedAt,
        notes: timesheet.notes,
      };
    });
    
    return {
      success: true,
      data: {
        timesheets: timesheetsWithDetails,
      },
    };
  }

  private calculateHours(clockIn: Date, clockOut: Date, breakDuration: number): { regularHours: number; overtimeHours: number } {
    if (!clockIn || !clockOut) {
      return { regularHours: 0, overtimeHours: 0 };
    }
    
    const clockInTime = new Date(clockIn).getTime();
    const clockOutTime = new Date(clockOut).getTime();
    
    // Calculate total worked time in milliseconds
    const totalWorkTime = clockOutTime - clockInTime - (breakDuration * 60 * 1000);
    
    // Convert to hours
    const totalHours = totalWorkTime / (1000 * 60 * 60);
    
    // Regular hours are up to 8 hours per day
    const regularHours = Math.min(totalHours, 8);
    
    // Overtime is anything over 8 hours
    const overtimeHours = Math.max(0, totalHours - 8);
    
    return {
      regularHours: Math.round(regularHours * 100) / 100, // Round to 2 decimal places
      overtimeHours: Math.round(overtimeHours * 100) / 100,
    };
  }
}