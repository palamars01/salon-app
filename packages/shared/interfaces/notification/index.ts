import { NotificationStatusEnum } from "../../enums";

export enum NotificationsType {
  APPOINTMENT_CREATED = "appointment created",
  QUEUE_UPDATED = "queue updated",
  FIRST_IN_QUEUE = "first in queue",
}

export interface Notification {
  id: string;
  title: string;
  receiver: "salon" | "customer";
  salon: {
    id: string;
    name: string;
    adminId?: string;
  };
  customer: {
    id: string;
    fName: string;
  };
  type: NotificationsType;
  status: NotificationStatusEnum;
  description: string;
  timePassed: string;
  privateWorkerId?: string;
  appointmentId?: string;
}

export interface NotificationSchema
  extends Omit<Notification, "id" | "timePassed"> {}
