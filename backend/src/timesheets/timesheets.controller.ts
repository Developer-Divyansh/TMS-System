import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Patch, 
  Param, 
  Delete, 
  Query,
  UseGuards,
  Request
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { TimesheetsService } from './timesheets.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('timesheets')
@Controller('timesheets')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TimesheetsController {
  constructor(private readonly timesheetsService: TimesheetsService) {}

  @Get()
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Get all timesheets' })
  @ApiResponse({ status: 200, description: 'Timesheets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async findAll(@Query() query: any) {
    return this.timesheetsService.findAll(query);
  }

  @Get('my-timesheets')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get current user timesheets' })
  @ApiResponse({ status: 200, description: 'User timesheets retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyTimesheets(@Query() query: any, @Request() req) {
    return this.timesheetsService.getTimesheetsByUser(
      req.user.userId,
      query.startDate,
      query.endDate
    );
  }

  @Get(':id')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get timesheet by ID' })
  @ApiResponse({ status: 200, description: 'Timesheet retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const result = await this.timesheetsService.findById(id);
    
    // Staff can only view their own timesheets
    if (req.user.role === 'Staff' && result.data.userId !== req.user.userId) {
      throw new Error('You can only view your own timesheets');
    }
    
    return result;
  }

  @Post()
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Create new timesheet' })
  @ApiResponse({ status: 201, description: 'Timesheet created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(@Body() createTimesheetDto: any, @Request() req) {
    // Staff can only create timesheets for themselves
    const userId = req.user.role === 'Staff' ? req.user.userId : createTimesheetDto.userId;
    
    return this.timesheetsService.create(createTimesheetDto, userId);
  }

  @Patch(':id')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Update timesheet' })
  @ApiResponse({ status: 200, description: 'Timesheet updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  async update(@Param('id') id: string, @Body() updateTimesheetDto: any, @Request() req) {
    const timesheet = await this.timesheetsService.findById(id);
    
    // Staff can only update their own timesheets
    if (req.user.role === 'Staff' && timesheet.data.userId !== req.user.userId) {
      throw new Error('You can only update your own timesheets');
    }
    
    return this.timesheetsService.update(id, updateTimesheetDto);
  }

  @Patch(':id/approve')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Approve or reject timesheet' })
  @ApiResponse({ status: 200, description: 'Timesheet approved/rejected successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  async approve(
    @Param('id') id: string,
    @Body() approveDto: { approved: boolean; notes?: string },
    @Request() req
  ) {
    return this.timesheetsService.approve(
      id,
      req.user.userId,
      approveDto.approved,
      approveDto.notes
    );
  }

  @Delete(':id')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Delete timesheet' })
  @ApiResponse({ status: 200, description: 'Timesheet deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Timesheet not found' })
  async remove(@Param('id') id: string, @Request() req) {
    const timesheet = await this.timesheetsService.findById(id);
    
    // Staff can only delete their own timesheets
    if (req.user.role === 'Staff' && timesheet.data.userId !== req.user.userId) {
      throw new Error('You can only delete your own timesheets');
    }
    
    return this.timesheetsService.remove(id);
  }
}