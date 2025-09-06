import { Types } from "mongoose";
import { User } from "../../user";
import { Service } from "../service";
import { Appointment } from "../../appointment";
import { Salon } from "..";

export interface PrivateWorker {
  user: User;
  salon: Salon;
  services: Service[];
  id: string;
  defaultWaitTimeInMinutes: number;
  appointments: Appointment[];
  closestTimeToAppointment?: Date;
}

export interface PrivateWorkerSchema
  extends Omit<PrivateWorker, "user" | "appointments" | "salon" | "id"> {
  user: Types.ObjectId;
  salon: Types.ObjectId;
  services: Service[];
  appointments: Types.ObjectId[];
}
