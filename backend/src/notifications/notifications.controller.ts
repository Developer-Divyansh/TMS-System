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
import { NotificationsService } from './notifications.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('notifications')
@Controller('notifications')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({ status: 200, description: 'Notifications retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: any, @Request() req) {
    return this.notificationsService.findAll(req.user.userId, query);
  }

  @Get('unread-count')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get unread notifications count' })
  @ApiResponse({ status: 200, description: 'Unread count retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getUnreadCount(@Request() req) {
    return this.notificationsService.getUnreadCount(req.user.userId);
  }

  @Get(':id')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get notification by ID' })
  @ApiResponse({ status: 200, description: 'Notification retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    return this.notificationsService.findById(id, req.user.userId);
  }

  @Post()
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Create new notification' })
  @ApiResponse({ status: 201, description: 'Notification created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createNotificationDto: any) {
    return this.notificationsService.create(createNotificationDto);
  }

  @Patch(':id/read')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Mark notification as read' })
  @ApiResponse({ status: 200, description: 'Notification marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async markAsRead(@Param('id') id: string, @Request() req) {
    return this.notificationsService.markAsRead(id, req.user.userId);
  }

  @Patch('read-all')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Mark all notifications as read' })
  @ApiResponse({ status: 200, description: 'All notifications marked as read' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async markAllAsRead(@Request() req) {
    return this.notificationsService.markAllAsRead(req.user.userId);
  }

  @Delete(':id')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Delete notification' })
  @ApiResponse({ status: 200, description: 'Notification deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Notification not found' })
  async remove(@Param('id') id: string, @Request() req) {
    return this.notificationsService.delete(id, req.user.userId);
  }

  // Admin/Manager specific endpoints for creating different types of notifications
  @Post('shift-reminder')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Create shift reminder notification' })
  @ApiResponse({ status: 201, description: 'Shift reminder created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createShiftReminder(@Body() body: { userId: string; shiftId: string; shiftDate: string }) {
    return this.notificationsService.createShiftReminder(body.userId, body.shiftId, body.shiftDate);
  }

  @Post('schedule-change')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Create schedule change notification' })
  @ApiResponse({ status: 201, description: 'Schedule change notification created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createScheduleChange(@Body() body: { userId: string; changeDetails: any }) {
    return this.notificationsService.createScheduleChangeNotification(body.userId, body.changeDetails);
  }

  @Post('timesheet-status')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Create timesheet status notification' })
  @ApiResponse({ status: 201, description: 'Timesheet status notification created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async createTimesheetStatus(@Body() body: { userId: string; status: string; timesheetId: string }) {
    return this.notificationsService.createTimesheetStatusNotification(body.userId, body.status, body.timesheetId);
  }
}