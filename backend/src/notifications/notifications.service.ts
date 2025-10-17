import { Injectable, NotFoundException } from '@nestjs/common';
import { MockDatabaseService } from '../database/mock-database.service';

@Injectable()
export class NotificationsService {
  constructor(private readonly databaseService: MockDatabaseService) {}

  async findAll(userId: string, query: any) {
    const { isRead, type } = query;
    
    let notifications = this.databaseService.getNotificationsByUser(userId);
    
    // Filter by read status
    if (isRead !== undefined) {
      notifications = notifications.filter(notification => 
        notification.isRead === (isRead === 'true')
      );
    }
    
    // Filter by type
    if (type) {
      notifications = notifications.filter(notification => 
        notification.type === type
      );
    }
    
    // Sort by creation date (newest first)
    notifications.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    
    return {
      success: true,
      data: {
        notifications,
      },
    };
  }

  async findById(id: string, userId: string) {
    const notification = this.databaseService.getNotificationById(id);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    
    // Check if notification belongs to the user
    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }
    
    return {
      success: true,
      data: notification,
    };
  }

  async create(notificationData: any) {
    const notification = this.databaseService.createNotification({
      userId: notificationData.userId,
      type: notificationData.type,
      title: notificationData.title,
      message: notificationData.message,
      metadata: notificationData.metadata || {},
      isRead: false,
      scheduledAt: notificationData.scheduledAt,
      sentAt: new Date(),
    });
    
    // Mock external service integration
    await this.sendExternalNotification(notification);
    
    return {
      success: true,
      data: {
        id: notification.id,
        createdAt: notification.createdAt,
      },
    };
  }

  async markAsRead(id: string, userId: string) {
    const notification = this.databaseService.getNotificationById(id);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    
    // Check if notification belongs to the user
    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }
    
    const updatedNotification = this.databaseService.updateNotification(id, {
      isRead: true,
    });
    
    return {
      success: true,
      data: {
        id: updatedNotification.id,
        isRead: updatedNotification.isRead,
      },
    };
  }

  async markAllAsRead(userId: string) {
    const notifications = this.databaseService.getNotificationsByUser(userId);
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    for (const notification of unreadNotifications) {
      this.databaseService.updateNotification(notification.id, {
        isRead: true,
      });
    }
    
    return {
      success: true,
      data: {
        markedAsRead: unreadNotifications.length,
      },
    };
  }

  async delete(id: string, userId: string) {
    const notification = this.databaseService.getNotificationById(id);
    
    if (!notification) {
      throw new NotFoundException('Notification not found');
    }
    
    // Check if notification belongs to the user
    if (notification.userId !== userId) {
      throw new NotFoundException('Notification not found');
    }
    
    this.databaseService.deleteNotification(id);
    
    return {
      success: true,
      message: 'Notification deleted successfully',
    };
  }

  async getUnreadCount(userId: string) {
    const notifications = this.databaseService.getNotificationsByUser(userId);
    const unreadCount = notifications.filter(n => !n.isRead).length;
    
    return {
      success: true,
      data: {
        unreadCount,
      },
    };
  }

  // Mock external notification methods
  private async sendExternalNotification(notification: any) {
    // Mock PACO integration
    if (notification.type === 'shift_reminder' || notification.type === 'schedule_change') {
      await this.sendToPACO(notification);
    }
    
    // Mock email service
    if (notification.type === 'timesheet_approved' || notification.type === 'timesheet_rejected') {
      await this.sendEmail(notification);
    }
    
    // Mock SMS service
    if (notification.type === 'urgent_shift' || notification.type === 'shift_cancellation') {
      await this.sendSMS(notification);
    }
  }

  private async sendToPACO(notification: any) {
    // Mock PACO API call
    console.log(`Sending notification to PACO: ${notification.title}`);
    // In a real implementation, you would make an HTTP request to the PACO API
    return Promise.resolve();
  }

  private async sendEmail(notification: any) {
    // Mock email service
    console.log(`Sending email notification: ${notification.title}`);
    // In a real implementation, you would use a service like SendGrid, Nodemailer, etc.
    return Promise.resolve();
  }

  private async sendSMS(notification: any) {
    // Mock SMS service
    console.log(`Sending SMS notification: ${notification.title}`);
    // In a real implementation, you would use a service like Twilio, AWS SNS, etc.
    return Promise.resolve();
  }

  // Utility methods for creating different types of notifications
  async createShiftReminder(userId: string, shiftId: string, shiftDate: string) {
    return this.create({
      userId,
      type: 'shift_reminder',
      title: 'Shift Reminder',
      message: `You have a shift scheduled for ${shiftDate}`,
      metadata: {
        shiftId,
        shiftDate,
      },
      scheduledAt: new Date(),
    });
  }

  async createScheduleChangeNotification(userId: string, changeDetails: any) {
    return this.create({
      userId,
      type: 'schedule_change',
      title: 'Schedule Change',
      message: `Your schedule has been updated: ${changeDetails.description}`,
      metadata: changeDetails,
      scheduledAt: new Date(),
    });
  }

  async createTimesheetStatusNotification(userId: string, status: string, timesheetId: string) {
    const title = status === 'approved' ? 'Timesheet Approved' : 'Timesheet Rejected';
    const message = status === 'approved' 
      ? 'Your timesheet has been approved'
      : 'Your timesheet has been rejected. Please review and resubmit.';
    
    return this.create({
      userId,
      type: `timesheet_${status}`,
      title,
      message,
      metadata: {
        timesheetId,
        status,
      },
      scheduledAt: new Date(),
    });
  }
}