import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MockDatabaseService } from '../database/mock-database.service';

@Injectable()
export class RotaService {
  constructor(private readonly databaseService: MockDatabaseService) {}

  async findAll(query: any) {
    const { startDate, endDate, userId, teamId, status } = query;
    
    let shifts = this.databaseService.getAllShifts();
    
    // Filter by date range
    if (startDate) {
      shifts = shifts.filter(shift => shift.shiftDate >= startDate);
    }
    if (endDate) {
      shifts = shifts.filter(shift => shift.shiftDate <= endDate);
    }
    
    // Filter by user
    if (userId) {
      shifts = shifts.filter(shift => shift.userId === userId);
    }
    
    // Filter by team
    if (teamId) {
      shifts = shifts.filter(shift => shift.teamId === teamId);
    }
    
    // Filter by status
    if (status) {
      shifts = shifts.filter(shift => shift.status === status);
    }
    
    // Get detailed information for each shift
    const shiftsWithDetails = shifts.map(shift => {
      const user = this.databaseService.getUserById(shift.userId);
      const team = this.databaseService.getTeamById(shift.teamId);
      const shiftType = this.databaseService.getShiftTypeById(shift.shiftTypeId);
      
      return {
        id: shift.id,
        userId: shift.userId,
        user: user ? {
          firstName: user.firstName,
          lastName: user.lastName,
        } : null,
        teamId: shift.teamId,
        team: team ? {
          name: team.name,
        } : null,
        shiftType: shiftType ? {
          name: shiftType.name,
          startTime: shiftType.startTime,
          endTime: shiftType.endTime,
          breakDuration: shiftType.breakDuration,
          color: shiftType.color,
        } : null,
        shiftDate: shift.shiftDate,
        actualStartTime: shift.actualStartTime,
        actualEndTime: shift.actualEndTime,
        actualBreakDuration: shift.actualBreakDuration,
        status: shift.status,
        notes: shift.notes,
        createdAt: shift.createdAt,
        updatedAt: shift.updatedAt,
      };
    });
    
    return {
      success: true,
      data: {
        shifts: shiftsWithDetails,
      },
    };
  }

  async findById(id: string) {
    const shift = this.databaseService.getShiftById(id);
    
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    
    const user = this.databaseService.getUserById(shift.userId);
    const team = this.databaseService.getTeamById(shift.teamId);
    const shiftType = this.databaseService.getShiftTypeById(shift.shiftTypeId);
    
    return {
      success: true,
      data: {
        id: shift.id,
        userId: shift.userId,
        user: user ? {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
        } : null,
        teamId: shift.teamId,
        team: team ? {
          name: team.name,
          description: team.description,
        } : null,
        shiftType: shiftType ? {
          name: shiftType.name,
          startTime: shiftType.startTime,
          endTime: shiftType.endTime,
          breakDuration: shiftType.breakDuration,
          color: shiftType.color,
        } : null,
        shiftDate: shift.shiftDate,
        actualStartTime: shift.actualStartTime,
        actualEndTime: shift.actualEndTime,
        actualBreakDuration: shift.actualBreakDuration,
        status: shift.status,
        notes: shift.notes,
        createdAt: shift.createdAt,
        updatedAt: shift.updatedAt,
      },
    };
  }

  async create(shiftData: any) {
    // Validate user exists
    const user = this.databaseService.getUserById(shiftData.userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    // Validate team exists
    const team = this.databaseService.getTeamById(shiftData.teamId);
    if (!team) {
      throw new BadRequestException('Team not found');
    }
    
    // Validate shift type exists
    const shiftType = this.databaseService.getShiftTypeById(shiftData.shiftTypeId);
    if (!shiftType) {
      throw new BadRequestException('Shift type not found');
    }
    
    // Check for conflicts
    const conflicts = await this.checkForConflicts(
      shiftData.userId,
      shiftData.shiftDate,
      shiftData.shiftTypeId
    );
    
    if (conflicts.length > 0) {
      throw new BadRequestException('Shift conflicts with existing shifts');
    }
    
    const shift = this.databaseService.createShift({
      userId: shiftData.userId,
      teamId: shiftData.teamId,
      shiftTypeId: shiftData.shiftTypeId,
      shiftDate: shiftData.shiftDate,
      status: 'scheduled',
      notes: shiftData.notes || '',
    });
    
    return {
      success: true,
      data: {
        id: shift.id,
        userId: shift.userId,
        teamId: shift.teamId,
        shiftTypeId: shift.shiftTypeId,
        shiftDate: shift.shiftDate,
        status: shift.status,
        createdAt: shift.createdAt,
      },
    };
  }

  async update(id: string, updateData: any) {
    const shift = this.databaseService.getShiftById(id);
    
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    
    // Validate team exists if being updated
    if (updateData.teamId) {
      const team = this.databaseService.getTeamById(updateData.teamId);
      if (!team) {
        throw new BadRequestException('Team not found');
      }
    }
    
    // Validate shift type exists if being updated
    if (updateData.shiftTypeId) {
      const shiftType = this.databaseService.getShiftTypeById(updateData.shiftTypeId);
      if (!shiftType) {
        throw new BadRequestException('Shift type not found');
      }
    }
    
    // Check for conflicts if date or user is being updated
    if (updateData.userId || updateData.shiftDate || updateData.shiftTypeId) {
      const userId = updateData.userId || shift.userId;
      const shiftDate = updateData.shiftDate || shift.shiftDate;
      const shiftTypeId = updateData.shiftTypeId || shift.shiftTypeId;
      
      const conflicts = await this.checkForConflicts(userId, shiftDate, shiftTypeId, id);
      
      if (conflicts.length > 0) {
        throw new BadRequestException('Shift conflicts with existing shifts');
      }
    }
    
    const updatedShift = this.databaseService.updateShift(id, updateData);
    
    return {
      success: true,
      data: {
        id: updatedShift.id,
        updatedAt: updatedShift.updatedAt,
      },
    };
  }

  async remove(id: string) {
    const shift = this.databaseService.getShiftById(id);
    
    if (!shift) {
      throw new NotFoundException('Shift not found');
    }
    
    this.databaseService.deleteShift(id);
    
    return {
      success: true,
      message: 'Shift deleted successfully',
    };
  }

  async getShiftTypes() {
    const shiftTypes = this.databaseService.getAllShiftTypes();
    
    return {
      success: true,
      data: shiftTypes,
    };
  }

  private async checkForConflicts(userId: string, shiftDate: string, shiftTypeId: string, excludeShiftId?: string): Promise<any[]> {
    const shiftType = this.databaseService.getShiftTypeById(shiftTypeId);
    if (!shiftType) {
      return [];
    }
    
    const userShifts = this.databaseService.getShiftsByUser(userId);
    const conflictingShifts = userShifts.filter(shift => {
      // Skip the shift being updated
      if (excludeShiftId && shift.id === excludeShiftId) {
        return false;
      }
      
      // Check if same date
      if (shift.shiftDate !== shiftDate) {
        return false;
      }
      
      // Get the shift type for the existing shift
      const existingShiftType = this.databaseService.getShiftTypeById(shift.shiftTypeId);
      if (!existingShiftType) {
        return false;
      }
      
      // Simple conflict detection: if same date, check time overlap
      // For now, we'll consider any two shifts on the same day as a conflict
      // In a real implementation, you would check actual time overlap
      return true;
    });
    
    return conflictingShifts;
  }

  async getShiftsByUser(userId: string, startDate?: string, endDate?: string) {
    let shifts = this.databaseService.getShiftsByUser(userId);
    
    // Filter by date range
    if (startDate) {
      shifts = shifts.filter(shift => shift.shiftDate >= startDate);
    }
    if (endDate) {
      shifts = shifts.filter(shift => shift.shiftDate <= endDate);
    }
    
    const shiftsWithDetails = shifts.map(shift => {
      const shiftType = this.databaseService.getShiftTypeById(shift.shiftTypeId);
      return {
        id: shift.id,
        shiftDate: shift.shiftDate,
        shiftType: shiftType ? {
          name: shiftType.name,
          startTime: shiftType.startTime,
          endTime: shiftType.endTime,
          color: shiftType.color,
        } : null,
        status: shift.status,
        notes: shift.notes,
      };
    });
    
    return {
      success: true,
      data: {
        shifts: shiftsWithDetails,
      },
    };
  }
}