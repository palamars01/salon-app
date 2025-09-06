import { PublicUser } from "../user";
import { AppointmentStatusEnum } from "../../enums";
import { Types } from "mongoose";

export interface Appointment {
  id: string;
  salon: {
    id: string;
    adminId: string;
    name: string;
    address: string;
    city: string;
  };
  customer: PublicUser;
  services: { id: string; duration: number; name: string }[];
  status: AppointmentStatusEnum;
  arrivalTime: Date;
  endTime: Date;
  phone: string;
  queuePosition: number;
  privateWorkerId?: string;
}

export interface AppointmentSchema
  extends Omit<Appointment, "customer" | "id"> {
  customer: Types.ObjectId;
}

export interface CreateAppointmentResponse {
  id: string;
  joinTime: string;
  arrivalTime: string;
  queuePosition: number;
}

export interface AppointmentStatus
  extends Omit<CreateAppointmentResponse, "queuePosition"> {
  salonName: string;
  waitTimeInMinutes: number;
  privateWorkerName?: string;
}

export interface DashboardAppointment {
  id: string;
  customer: {
    fName: string;
    phone: string;
    id: string;
  };
  salon: {
    id: string;
    name: string;
    address: string;
  };
  services?: string[];
  waitTimeInMinutes?: number;
  queuePosition: number;
  arrivalTime?: string;
  status: AppointmentStatusEnum;
}
