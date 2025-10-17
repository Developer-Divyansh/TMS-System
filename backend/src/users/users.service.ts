import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MockDatabaseService } from '../database/mock-database.service';
import { CreateUserDto, UpdateUserDto, QueryUserDto } from './dto';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UsersService {
  constructor(private readonly databaseService: MockDatabaseService) {}

  async findAll(query: QueryUserDto) {
    const { page = 1, limit = 10, teamId, isActive, search, roleId } = query;
    
    let users = this.databaseService.getAllUsers();
    
    // Filter by active status
    if (isActive !== undefined) {
      users = users.filter(user => user.isActive === isActive);
    }
    
    // Filter by team
    if (teamId) {
      const userTeams = this.databaseService.getTeamUsers(teamId);
      const userIds = userTeams.map(ut => ut.userId);
      users = users.filter(user => userIds.includes(user.id));
    }
    
    // Filter by role
    if (roleId) {
      users = users.filter(user => user.roleId === roleId);
    }
    
    // Search functionality
    if (search) {
      const searchLower = search.toLowerCase();
      users = users.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower)
      );
    }
    
    // Get role information for each user
    const usersWithDetails = users.map(user => {
      const role = this.databaseService.getRoleById(user.roleId);
      const userTeams = this.databaseService.getUserTeams(user.id);
      const teams = userTeams.map(ut => {
        const team = this.databaseService.getTeamById(ut.teamId);
        return team ? { id: team.id, name: team.name } : null;
      }).filter(Boolean);
      
      return {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: role ? { name: role.name } : null,
        teams,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      };
    });
    
    // Pagination
    const total = usersWithDetails.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedUsers = usersWithDetails.slice(startIndex, endIndex);
    
    return {
      success: true,
      data: {
        users: paginatedUsers,
        pagination: {
          page,
          limit,
          total,
          totalPages,
        },
      },
    };
  }

  async findById(id: string) {
    const user = this.databaseService.getUserById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const role = this.databaseService.getRoleById(user.roleId);
    const userTeams = this.databaseService.getUserTeams(user.id);
    const teams = userTeams.map(ut => {
      const team = this.databaseService.getTeamById(ut.teamId);
      return team ? { id: team.id, name: team.name } : null;
    }).filter(Boolean);
    
    return {
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        role: role ? {
          name: role.name,
          permissions: role.permissions,
        } : null,
        teams,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  async create(createUserDto: CreateUserDto) {
    // Check if user with email already exists
    const existingUser = this.databaseService.getUserByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }
    
    // Verify role exists
    const role = this.databaseService.getRoleById(createUserDto.roleId);
    if (!role) {
      throw new BadRequestException('Invalid role');
    }
    
    // Verify teams exist
    if (createUserDto.teamIds && createUserDto.teamIds.length > 0) {
      for (const teamId of createUserDto.teamIds) {
        const team = this.databaseService.getTeamById(teamId);
        if (!team) {
          throw new BadRequestException(`Team with ID ${teamId} not found`);
        }
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    
    // Create user
    const user = this.databaseService.createUser({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      password: hashedPassword,
      roleId: createUserDto.roleId,
      phoneNumber: createUserDto.phoneNumber,
      isActive: true,
    });
    
    // Add user to teams
    if (createUserDto.teamIds && createUserDto.teamIds.length > 0) {
      for (const teamId of createUserDto.teamIds) {
        this.databaseService.addUserToTeam(user.id, teamId);
      }
    }
    
    return {
      success: true,
      data: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: { name: role.name },
        isActive: user.isActive,
        createdAt: user.createdAt,
      },
    };
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = this.databaseService.getUserById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check if email is being changed and if it already exists
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = this.databaseService.getUserByEmail(updateUserDto.email);
      if (existingUser) {
        throw new BadRequestException('User with this email already exists');
      }
    }
    
    // Verify role exists if being updated
    if (updateUserDto.roleId) {
      const role = this.databaseService.getRoleById(updateUserDto.roleId);
      if (!role) {
        throw new BadRequestException('Invalid role');
      }
    }
    
    // Prepare update data
    const updateData: any = { ...updateUserDto };
    
    // Hash password if being updated
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    
    // Update user
    const updatedUser = this.databaseService.updateUser(id, updateData);
    
    // Update team associations if provided
    if (updateUserDto.teamIds) {
      // Remove user from all current teams
      const currentTeams = this.databaseService.getUserTeams(id);
      for (const userTeam of currentTeams) {
        this.databaseService.removeUserFromTeam(id, userTeam.teamId);
      }
      
      // Add user to new teams
      for (const teamId of updateUserDto.teamIds) {
        const team = this.databaseService.getTeamById(teamId);
        if (team) {
          this.databaseService.addUserToTeam(id, teamId);
        }
      }
    }
    
    return {
      success: true,
      data: {
        id: updatedUser.id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phoneNumber: updatedUser.phoneNumber,
        updatedAt: updatedUser.updatedAt,
      },
    };
  }

  async remove(id: string) {
    const user = this.databaseService.getUserById(id);
    
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Remove user from all teams
    const userTeams = this.databaseService.getUserTeams(id);
    for (const userTeam of userTeams) {
      this.databaseService.removeUserFromTeam(id, userTeam.teamId);
    }
    
    // Delete user
    this.databaseService.deleteUser(id);
    
    return {
      success: true,
      message: 'User deleted successfully',
    };
  }
}