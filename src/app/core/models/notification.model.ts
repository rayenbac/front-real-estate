export type NotificationType = 'property' | 'transaction' | 'message' | 'payment' | 'viewing';
export type NotificationPriority = 'low' | 'medium' | 'high';

export interface Notification {
  id?: string; // Optional, as MongoDB generates it
  userId: string; // User ID
  type: string;
  title: string;
  message: string;
  isRead?: boolean; // Default is false
  relatedId?: string; // ID of related entity
  relatedType?: NotificationType; // The type of related entity
  scheduledFor?: Date; // Optional scheduled notification
  priority: NotificationPriority; // Must be one of 'low', 'medium', 'high'
  createdAt?: Date;
  updatedAt?: Date;
}
