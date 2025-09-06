import { Appointment } from "../appointment";

export interface Cutomer {
  userId: string;
  appointments?: Appointment[];
}
