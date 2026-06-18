export interface Notifications {
  id: string;
  userId: string;
  deviceToken: string;
  title: string;
  body: string;
  fcmNotificationType: string;
  isRead: boolean;
  creationTime: string; // ISO date string
}
export interface Notification {
    id: string;
    titleAr: string;
    titleEn: string;
    descriptionAr: string;
    descriptionEn: string;
    readDate: string;
    creationTime: string;
}



export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message: string;
    status: number;
  }

  export interface NotificationData {
    code: number;
    message: string;
    data: {
      totalCount: number;
      items: Notification[];
    };
  }

  export type NotificationResponse = ApiResponse<NotificationData>;

  export interface Clients {
    id: string;
    name: string;
    phoneNumber: string;
    profileImage: string | null;
}
export const FCM_NOTIFICATION_TYPES = [
  'SystemMaintenance',
  'SystemAlert',
  'AccountUpdate',
  'OrderPending',
  'OrderProcessing',
  'OrderStripped',
  'OrderDelivered',
  'OrderCanceled',
  'OrderDelayed',
  'ReturnRequested',
  'ReturnAccepted',
  'ReturnRejected',
  'Information',
  'Warning',
  'Error',
  'Success',
  'SystemUpdate'
];