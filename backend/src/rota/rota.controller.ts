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
import { RotaService } from './rota.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('shifts')
@Controller('shifts')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class RotaController {
  constructor(private readonly rotaService: RotaService) {}

  @Get()
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get all shifts' })
  @ApiResponse({ status: 200, description: 'Shifts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll(@Query() query: any, @Request() req) {
    // Staff can only see their own shifts
    if (req.user.role === 'Staff') {
      query.userId = req.user.userId;
    }
    
    return this.rotaService.findAll(query);
  }

  @Get('my-shifts')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get current user shifts' })
  @ApiResponse({ status: 200, description: 'User shifts retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getMyShifts(@Query() query: any, @Request() req) {
    return this.rotaService.getShiftsByUser(
      req.user.userId,
      query.startDate,
      query.endDate
    );
  }

  @Get('types')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get all shift types' })
  @ApiResponse({ status: 200, description: 'Shift types retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getShiftTypes() {
    return this.rotaService.getShiftTypes();
  }

  @Get(':id')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Get shift by ID' })
  @ApiResponse({ status: 200, description: 'Shift retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async findOne(@Param('id') id: string, @Request() req) {
    const result = await this.rotaService.findById(id);
    
    // Staff can only view their own shifts
    if (req.user.role === 'Staff' && result.data.userId !== req.user.userId) {
      throw new Error('You can only view your own shifts');
    }
    
    return result;
  }

  @Post()
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Create new shift' })
  @ApiResponse({ status: 201, description: 'Shift created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async create(@Body() createShiftDto: any) {
    return this.rotaService.create(createShiftDto);
  }

  @Patch(':id')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Update shift' })
  @ApiResponse({ status: 200, description: 'Shift updated successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async update(@Param('id') id: string, @Body() updateShiftDto: any) {
    return this.rotaService.update(id, updateShiftDto);
  }

  @Patch(':id/clock-in')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Clock in for shift' })
  @ApiResponse({ status: 200, description: 'Clocked in successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async clockIn(@Param('id') id: string, @Request() req) {
    const shift = await this.rotaService.findById(id);
    
    // Staff can only clock in for their own shifts
    if (req.user.role === 'Staff' && shift.data.userId !== req.user.userId) {
      throw new Error('You can only clock in for your own shifts');
    }
    
    return this.rotaService.update(id, {
      status: 'in_progress',
      actualStartTime: new Date(),
    });
  }

  @Patch(':id/clock-out')
  @Roles('Admin', 'Manager', 'Staff')
  @ApiOperation({ summary: 'Clock out from shift' })
  @ApiResponse({ status: 200, description: 'Clocked out successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async clockOut(
    @Param('id') id: string, 
    @Body() body: { breakDuration?: number },
    @Request() req
  ) {
    const shift = await this.rotaService.findById(id);
    
    // Staff can only clock out for their own shifts
    if (req.user.role === 'Staff' && shift.data.userId !== req.user.userId) {
      throw new Error('You can only clock out for your own shifts');
    }
    
    return this.rotaService.update(id, {
      status: 'completed',
      actualEndTime: new Date(),
      actualBreakDuration: body.breakDuration || 0,
    });
  }

  @Delete(':id')
  @Roles('Admin', 'Manager')
  @ApiOperation({ summary: 'Delete shift' })
  @ApiResponse({ status: 200, description: 'Shift deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  @ApiResponse({ status: 404, description: 'Shift not found' })
  async remove(@Param('id') id: string) {
    return this.rotaService.remove(id);
  }
}