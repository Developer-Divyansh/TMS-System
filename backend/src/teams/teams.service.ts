import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { MockDatabaseService } from '../database/mock-database.service';

@Injectable()
export class TeamsService {
  constructor(private readonly databaseService: MockDatabaseService) {}

  async findAll() {
    const teams = this.databaseService.getAllTeams();
    
    const teamsWithDetails = teams.map(team => {
      const manager = this.databaseService.getUserById(team.managerId);
      const teamUsers = this.databaseService.getTeamUsers(team.id);
      const users = teamUsers.map(ut => {
        const user = this.databaseService.getUserById(ut.userId);
        if (user) {
          const role = this.databaseService.getRoleById(user.roleId);
          return {
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: role ? { name: role.name } : null,
            joinedAt: ut.joinedAt,
          };
        }
        return null;
      }).filter(Boolean);
      
      return {
        id: team.id,
        name: team.name,
        description: team.description,
        manager: manager ? {
          id: manager.id,
          firstName: manager.firstName,
          lastName: manager.lastName,
          email: manager.email,
        } : null,
        members: users,
        isActive: team.isActive,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      };
    });
    
    return {
      success: true,
      data: teamsWithDetails,
    };
  }

  async findById(id: string) {
    const team = this.databaseService.getTeamById(id);
    
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    
    const manager = this.databaseService.getUserById(team.managerId);
    const teamUsers = this.databaseService.getTeamUsers(team.id);
    const users = teamUsers.map(ut => {
      const user = this.databaseService.getUserById(ut.userId);
      if (user) {
        const role = this.databaseService.getRoleById(user.roleId);
        return {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: role ? { name: role.name } : null,
          joinedAt: ut.joinedAt,
        };
      }
      return null;
    }).filter(Boolean);
    
    return {
      success: true,
      data: {
        id: team.id,
        name: team.name,
        description: team.description,
        manager: manager ? {
          id: manager.id,
          firstName: manager.firstName,
          lastName: manager.lastName,
          email: manager.email,
        } : null,
        members: users,
        isActive: team.isActive,
        createdAt: team.createdAt,
        updatedAt: team.updatedAt,
      },
    };
  }

  async create(teamData: any) {
    // Verify manager exists
    const manager = this.databaseService.getUserById(teamData.managerId);
    if (!manager) {
      throw new BadRequestException('Manager not found');
    }
    
    const team = this.databaseService.createTeam({
      name: teamData.name,
      description: teamData.description,
      managerId: teamData.managerId,
      isActive: true,
    });
    
    return {
      success: true,
      data: {
        id: team.id,
        name: team.name,
        description: team.description,
        managerId: team.managerId,
        isActive: team.isActive,
        createdAt: team.createdAt,
      },
    };
  }

  async update(id: string, updateData: any) {
    const team = this.databaseService.getTeamById(id);
    
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    
    // Verify manager exists if being updated
    if (updateData.managerId) {
      const manager = this.databaseService.getUserById(updateData.managerId);
      if (!manager) {
        throw new BadRequestException('Manager not found');
      }
    }
    
    const updatedTeam = this.databaseService.updateTeam(id, updateData);
    
    return {
      success: true,
      data: {
        id: updatedTeam.id,
        name: updatedTeam.name,
        description: updatedTeam.description,
        managerId: updatedTeam.managerId,
        isActive: updatedTeam.isActive,
        updatedAt: updatedTeam.updatedAt,
      },
    };
  }

  async remove(id: string) {
    const team = this.databaseService.getTeamById(id);
    
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    
    // Remove all users from the team
    const teamUsers = this.databaseService.getTeamUsers(id);
    for (const userTeam of teamUsers) {
      this.databaseService.removeUserFromTeam(userTeam.userId, id);
    }
    
    // Delete team
    this.databaseService.deleteTeam(id);
    
    return {
      success: true,
      message: 'Team deleted successfully',
    };
  }

  async addMember(teamId: string, userId: string) {
    const team = this.databaseService.getTeamById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    
    const user = this.databaseService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check if user is already in the team
    const userTeams = this.databaseService.getUserTeams(userId);
    const alreadyInTeam = userTeams.some(ut => ut.teamId === teamId);
    if (alreadyInTeam) {
      throw new BadRequestException('User is already a member of this team');
    }
    
    this.databaseService.addUserToTeam(userId, teamId);
    
    return {
      success: true,
      message: 'User added to team successfully',
    };
  }

  async removeMember(teamId: string, userId: string) {
    const team = this.databaseService.getTeamById(teamId);
    if (!team) {
      throw new NotFoundException('Team not found');
    }
    
    const user = this.databaseService.getUserById(userId);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    // Check if user is in the team
    const userTeams = this.databaseService.getUserTeams(userId);
    const inTeam = userTeams.some(ut => ut.teamId === teamId);
    if (!inTeam) {
      throw new BadRequestException('User is not a member of this team');
    }
    
    this.databaseService.removeUserFromTeam(userId, teamId);
    
    return {
      success: true,
      message: 'User removed from team successfully',
    };
  }
}