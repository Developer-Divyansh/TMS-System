import { Injectable, OnModuleInit } from '@nestjs/common';
import { JsonFileStorage } from './json-file.storage';
import * as bcrypt from 'bcrypt';
import {
  User,
  Team,
  Role,
  UserTeam,
  ShiftType,
  Shift,
  Timesheet,
  Notification,
} from './entities';

@Injectable()
export class MockDatabaseService implements OnModuleInit {
  constructor(private readonly storage: JsonFileStorage) {}

  async onModuleInit() {
    // Skip sample data initialization - data files already exist
    console.log('Mock database service initialized');
    // await this.initializeSampleData();
  }

  private async initializeSampleData() {
    // Check if data already exists
    const usersCount = this.storage.count('users');
    const rolesCount = this.storage.count('roles');

    if (usersCount > 0 || rolesCount > 0) {
      console.log('Database already initialized with sample data');
      return;
    }

    console.log('Initializing database with sample data...');

    // Create roles
    const adminRole = this.storage.create('roles', {
      name: 'Admin',
      description: 'System administrator with full access',
      permissions: [
        'users.create',
        'users.read',
        'users.update',
        'users.delete',
        'teams.create',
        'teams.read',
        'teams.update',
        'teams.delete',
        'shifts.create',
        'shifts.read',
        'shifts.update',
        'shifts.delete',
        'timesheets.create',
        'timesheets.read',
        'timesheets.update',
        'timesheets.delete',
        'timesheets.approve',
        'notifications.create',
        'notifications.read',
        'notifications.update',
        'notifications.delete',
      ],
      createdAt: new Date(),
    });

    const managerRole = this.storage.create('roles', {
      name: 'Manager',
      description: 'Team manager with limited access',
      permissions: [
        'users.read',
        'teams.read',
        'teams.update',
        'shifts.create',
        'shifts.read',
        'shifts.update',
        'shifts.delete',
        'timesheets.create',
        'timesheets.read',
        'timesheets.update',
        'timesheets.approve',
        'notifications.read',
      ],
      createdAt: new Date(),
    });

    const staffRole = this.storage.create('roles', {
      name: 'Staff',
      description: 'Regular staff member with basic access',
      permissions: [
        'users.read.own',
        'shifts.read.own',
        'timesheets.create',
        'timesheets.read.own',
        'timesheets.update.own',
        'notifications.read',
      ],
      createdAt: new Date(),
    });

    // Create users
    const hashedPassword = await bcrypt.hash('password123', 10);

    const adminUser = this.storage.create('users', {
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@rotasystem.com',
      password: hashedPassword,
      roleId: adminRole.id,
      phoneNumber: '+1234567890',
      isActive: true,
    });

    const managerUser = this.storage.create('users', {
      firstName: 'Manager',
      lastName: 'User',
      email: 'manager@rotasystem.com',
      password: hashedPassword,
      roleId: managerRole.id,
      phoneNumber: '+1234567891',
      isActive: true,
    });

    const staffUser1 = this.storage.create('users', {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john.doe@rotasystem.com',
      password: hashedPassword,
      roleId: staffRole.id,
      phoneNumber: '+1234567892',
      isActive: true,
    });

    const staffUser2 = this.storage.create('users', {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane.smith@rotasystem.com',
      password: hashedPassword,
      roleId: staffRole.id,
      phoneNumber: '+1234567893',
      isActive: true,
    });

    // Create teams
    const frontendTeam = this.storage.create('teams', {
      name: 'Frontend Team',
      description: 'Frontend development team',
      managerId: managerUser.id,
      isActive: true,
    });

    const backendTeam = this.storage.create('teams', {
      name: 'Backend Team',
      description: 'Backend development team',
      managerId: managerUser.id,
      isActive: true,
    });

    // Create user-team relationships
    this.storage.create('userTeams', {
      userId: managerUser.id,
      teamId: frontendTeam.id,
      joinedAt: new Date(),
    });

    this.storage.create('userTeams', {
      userId: managerUser.id,
      teamId: backendTeam.id,
      joinedAt: new Date(),
    });

    this.storage.create('userTeams', {
      userId: staffUser1.id,
      teamId: frontendTeam.id,
      joinedAt: new Date(),
    });

    this.storage.create('userTeams', {
      userId: staffUser2.id,
      teamId: backendTeam.id,
      joinedAt: new Date(),
    });

    // Create shift types
    const morningShift = this.storage.create('shiftTypes', {
      name: 'Morning',
      startTime: '09:00',
      endTime: '17:00',
      breakDuration: 60,
      color: '#3B82F6',
      isActive: true,
    });

    const eveningShift = this.storage.create('shiftTypes', {
      name: 'Evening',
      startTime: '17:00',
      endTime: '01:00',
      breakDuration: 45,
      color: '#8B5CF6',
      isActive: true,
    });

    const nightShift = this.storage.create('shiftTypes', {
      name: 'Night',
      startTime: '01:00',
      endTime: '09:00',
      breakDuration: 45,
      color: '#1F2937',
      isActive: true,
    });

    // Create sample shifts for the next week
    const today = new Date();
    for (let i = 0; i < 7; i++) {
      const shiftDate = new Date(today);
      shiftDate.setDate(today.getDate() + i);
      const dateString = shiftDate.toISOString().split('T')[0];

      // Morning shift for John
      this.storage.create('shifts', {
        userId: staffUser1.id,
        teamId: frontendTeam.id,
        shiftTypeId: morningShift.id,
        shiftDate: dateString,
        status: 'scheduled',
        notes: 'Regular morning shift',
      });

      // Evening shift for Jane
      if (i % 2 === 0) {
        this.storage.create('shifts', {
          userId: staffUser2.id,
          teamId: backendTeam.id,
          shiftTypeId: eveningShift.id,
          shiftDate: dateString,
          status: 'scheduled',
          notes: 'Evening shift',
        });
      }
    }

    console.log('Sample data initialized successfully');
  }

  // User methods
  getAllUsers(): User[] {
    return this.storage.findAll('users');
  }

  getUserById(id: string): User | null {
    return this.storage.findById('users', id);
  }

  getUserByEmail(email: string): User | null {
    const users = this.storage.findBy('users', user => user.email === email);
    return users.length > 0 ? users[0] : null;
  }

  createUser(userData: Partial<User>): User {
    return this.storage.create('users', userData);
  }

  updateUser(id: string, updates: Partial<User>): User | null {
    return this.storage.update('users', id, updates);
  }

  deleteUser(id: string): boolean {
    return this.storage.delete('users', id);
  }

  // Team methods
  getAllTeams(): Team[] {
    return this.storage.findAll('teams');
  }

  getTeamById(id: string): Team | null {
    return this.storage.findById('teams', id);
  }

  createTeam(teamData: Partial<Team>): Team {
    return this.storage.create('teams', teamData);
  }

  updateTeam(id: string, updates: Partial<Team>): Team | null {
    return this.storage.update('teams', id, updates);
  }

  deleteTeam(id: string): boolean {
    return this.storage.delete('teams', id);
  }

  // Role methods
  getAllRoles(): Role[] {
    return this.storage.findAll('roles');
  }

  getRoleById(id: string): Role | null {
    return this.storage.findById('roles', id);
  }

  // UserTeam methods
  getUserTeams(userId: string): UserTeam[] {
    return this.storage.findBy('userTeams', ut => ut.userId === userId);
  }

  getTeamUsers(teamId: string): UserTeam[] {
    return this.storage.findBy('userTeams', ut => ut.teamId === teamId);
  }

  addUserToTeam(userId: string, teamId: string): UserTeam {
    return this.storage.create('userTeams', {
      userId,
      teamId,
      joinedAt: new Date(),
    });
  }

  removeUserFromTeam(userId: string, teamId: string): boolean {
    const userTeams = this.storage.findBy('userTeams', ut => 
      ut.userId === userId && ut.teamId === teamId
    );
    if (userTeams.length > 0) {
      return this.storage.delete('userTeams', userTeams[0].id);
    }
    return false;
  }

  // Shift type methods
  getAllShiftTypes(): ShiftType[] {
    return this.storage.findAll('shiftTypes');
  }

  getShiftTypeById(id: string): ShiftType | null {
    return this.storage.findById('shiftTypes', id);
  }

  // Shift methods
  getAllShifts(): Shift[] {
    return this.storage.findAll('shifts');
  }

  getShiftById(id: string): Shift | null {
    return this.storage.findById('shifts', id);
  }

  createShift(shiftData: Partial<Shift>): Shift {
    return this.storage.create('shifts', shiftData);
  }

  updateShift(id: string, updates: Partial<Shift>): Shift | null {
    return this.storage.update('shifts', id, updates);
  }

  deleteShift(id: string): boolean {
    return this.storage.delete('shifts', id);
  }

  getShiftsByUser(userId: string): Shift[] {
    return this.storage.findBy('shifts', shift => shift.userId === userId);
  }

  getShiftsByTeam(teamId: string): Shift[] {
    return this.storage.findBy('shifts', shift => shift.teamId === teamId);
  }

  getShiftsByDateRange(startDate: string, endDate: string): Shift[] {
    return this.storage.findBy('shifts', shift => 
      shift.shiftDate >= startDate && shift.shiftDate <= endDate
    );
  }

  // Timesheet methods
  getAllTimesheets(): Timesheet[] {
    return this.storage.findAll('timesheets');
  }

  getTimesheetById(id: string): Timesheet | null {
    return this.storage.findById('timesheets', id);
  }

  createTimesheet(timesheetData: Partial<Timesheet>): Timesheet {
    return this.storage.create('timesheets', timesheetData);
  }

  updateTimesheet(id: string, updates: Partial<Timesheet>): Timesheet | null {
    return this.storage.update('timesheets', id, updates);
  }

  deleteTimesheet(id: string): boolean {
    return this.storage.delete('timesheets', id);
  }

  getTimesheetsByUser(userId: string): Timesheet[] {
    return this.storage.findBy('timesheets', timesheet => timesheet.userId === userId);
  }

  getTimesheetsByStatus(status: string): Timesheet[] {
    return this.storage.findBy('timesheets', timesheet => timesheet.status === status);
  }

  // Notification methods
  getAllNotifications(): Notification[] {
    return this.storage.findAll('notifications');
  }

  getNotificationById(id: string): Notification | null {
    return this.storage.findById('notifications', id);
  }

  createNotification(notificationData: Partial<Notification>): Notification {
    return this.storage.create('notifications', notificationData);
  }

  updateNotification(id: string, updates: Partial<Notification>): Notification | null {
    return this.storage.update('notifications', id, updates);
  }

  deleteNotification(id: string): boolean {
    return this.storage.delete('notifications', id);
  }

  getNotificationsByUser(userId: string): Notification[] {
    return this.storage.findBy('notifications', notification => notification.userId === userId);
  }
}