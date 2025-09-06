import { toJSON } from '@/mongo/common';
import { AppointmentStatusEnum, RolesEnum } from '@repo/shared/enums';

import dayjs from 'dayjs';
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(minMax);

import { Appointment } from '@/mongo/schemas/Appointment/appointment.schema';
import { SalonModel, Salon } from '../../Salon/salon.schema';
import { PrivateWorker } from '../../PrivateWorker/privateWorker.schema';
import { NotificationService } from '@/notification/notification.service';
import { NotificationGateway } from '@/notification/notification.gateway';
import { NotificationsType } from '@repo/shared/interfaces/notification';
import { User } from '../../User/user.schema';

/* Middlewares */

export const handleQueueUpdate = (
  salonModel: SalonModel,
  notificationService: NotificationService,
  notificationGateway: NotificationGateway,
) =>
  async function () {
    const updates: any = this.getUpdate();

    if (
      [
        AppointmentStatusEnum.checkedIn,
        AppointmentStatusEnum.declined,
      ].includes(updates?.status) ||
      this.op === 'deleteOne'
    ) {
      /* Update cutomer queue position */
      const doc: Appointment & { customer: User } = await this.model.findOne(
        this.getQuery(),
      );

      let appointmentOwner: Salon | PrivateWorker | null = null;
      const salon = await salonModel.findOne({ _id: doc.salon.id });

      appointmentOwner = salon;

      if (doc.privateWorkerId) {
        const populateSalon = await salon!.populate<{
          privateWorkers: PrivateWorker[];
        }>('privateWorkers');
        appointmentOwner = populateSalon.privateWorkers.find(
          (pw) => pw.id === doc.privateWorkerId,
        )!;
      }

      const appointments: Appointment[] = await this.model.find({
        'salon.id': { $eq: doc.salon.id },
        status: {
          $in: [AppointmentStatusEnum.approved],
        },
        endTime: { $gt: dayjs().utc().toDate() },
      });

      const appointmentsToUpdate = appointments.filter(
        (a) => a.queuePosition > doc.queuePosition,
      );

      /* Previous arrival time */
      let prevArrivalTime;
      let currentArivalTime = doc.arrivalTime;

      let closestTimeToAppointment = dayjs(
        appointmentOwner!.closestTimeToAppointment,
      );

      if (appointmentsToUpdate.length) {
        for (const appointment of appointmentsToUpdate) {
          prevArrivalTime = appointment.arrivalTime;
          const updatedQueuePosition = appointment.queuePosition - 1;

          /* Update queue position */
          appointment.queuePosition = updatedQueuePosition;
          /* Update arrival time */
          appointment.arrivalTime = currentArivalTime;

          /* Total services duration */
          const totalServicesDuration = appointment.services.reduce(
            (prev, curr) => prev + curr.duration,
            0,
          );

          const endTime = dayjs(appointment.arrivalTime)
            .add(totalServicesDuration, 'minute')
            .utc()
            .toDate();

          /* Update appointment end time */
          appointment.endTime = endTime;

          /* Set new arrival time for the next appointment */
          currentArivalTime = prevArrivalTime;

          await appointment.save();

          if (closestTimeToAppointment) {
            closestTimeToAppointment = dayjs.min(
              dayjs(closestTimeToAppointment),
              dayjs(endTime),
            );
          }
          const publicAppointment = appointment.toPublic();
          if (updatedQueuePosition === 1) {
            notificationService.create(
              publicAppointment,
              NotificationsType.FIRST_IN_QUEUE,
              RolesEnum.customer,
            );

            notificationGateway.emitNotificationCreate(
              publicAppointment.customer.id,
            );
          } else {
            notificationService.create(
              publicAppointment,
              NotificationsType.QUEUE_UPDATED,
              RolesEnum.customer,
            );

            notificationGateway.emitNotificationCreate(
              publicAppointment.customer.id,
            );
          }
        }
      }

      if (
        (appointmentOwner as Salon).employees &&
        this.op === 'deleteOne' &&
        appointments.length - 1 < (appointmentOwner as Salon).employees
      ) {
        appointmentOwner!.closestTimeToAppointment = undefined;
      } else {
        appointmentOwner!.closestTimeToAppointment =
          closestTimeToAppointment.toDate();
      }
      await appointmentOwner?.save();
    }
  };

// Methods
const toPublic = function (): Appointment {
  const appointment = this._doc;

  delete appointment.updatedAt;
  delete appointment.salon.adminId;
  if (!appointment.id) {
    appointment.id = appointment._id.toString();
  }
  appointment._id && delete appointment._id;
  delete appointment.__v;

  appointment.customer = {
    id: appointment.customer.id,
    ...appointment.customer.toPublic(),
  };
  return appointment;
};

export const methods = {
  toPublic,
};

export const options = { toJSON };

export const middlewares = { handleQueueUpdate };
