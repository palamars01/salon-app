import { Types } from "mongoose";

import { PrivateWorker } from "./privateWorker";
import { Service } from "./service";
import { Appointment } from "../appointment";

export interface Salon {
  id: string;
  name: string;
  address: string;
  ownerName: string;
  city: string;
  employees: number;
  privateWorkers: PrivateWorker[];
  services: Service[];
  defaultWaitTimeInMinutes: number;
  appointments?: Appointment[];
  closestTimeToAppointment?: Date;
  notificationsSettings: {
    sms: boolean;
    push: boolean;
  };
}

export interface SalonSchema
  extends Omit<Salon, "privateWorkers" | "appointments" | "id"> {
  admin: Types.ObjectId;
  privateWorkers: Types.ObjectId[];
  appointments?: Types.ObjectId[];
}

export interface PublicSalon extends Salon {
  id: string;
}

export interface CustomerDashboardSalon {
  id: string;
  name: string;
  address: string;
  city: string;
  services: { id: string; name: string; duration: number }[];
  waitTimeInMinutes: number;
  privateWorkerName?: string;
  privateWorkerId?: string;
  freeSeatsAvailable?: boolean;
}

export interface AdminWidgets {
  totalSalons: number;
  activeQueues: number;
  totalCustomers: number;
}
