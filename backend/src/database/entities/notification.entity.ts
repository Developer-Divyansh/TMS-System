export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  metadata?: Record<string, any>;
  isRead: boolean;
  scheduledAt?: Date;
  sentAt?: Date;
  createdAt: Date;
}