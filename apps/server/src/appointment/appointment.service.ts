import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';

import {
  Appointment,
  AppointmentModel,
} from '@/mongo/schemas/Appointment/appointment.schema';
import { User } from '@/mongo/schemas/User/user.schema';
import { Salon } from '@/mongo/schemas/Salon/salon.schema';
import { PrivateWorker } from '@/mongo/schemas/PrivateWorker/privateWorker.schema';

import { SalonService } from '@/salon/salon.service';
import { PrivateWorkersService } from '@/privateWorkers/privateWorkers.service';
import { NotificationService } from '@/notification/notification.service';
import { NotificationGateway } from '@/notification/notification.gateway';

import {
  AppointmentStatus,
  CreateAppointmentResponse,
  DashboardAppointment,
} from '@repo/shared/interfaces/appointment';
import {
  ApiRoutes,
  AppointmentStatusEnum,
  RolesEnum,
} from '@repo/shared/enums';
import { PrivateWorker as PrivateWorkerInterface } from '@repo/shared/interfaces/salon/privateWorker';
import { NotificationsType } from '@repo/shared/interfaces/notification';

import { filterActiveAppointments, normalizeAppointment } from '@/common/utils';
import { BaseErrors } from '@/common/constants';
import { throwHttpException } from '@/common/guards/utils';

import { AppointmentDTO } from './dto/appointment.dto';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: AppointmentModel,
    private salonService: SalonService,
    private privateWorkerService: PrivateWorkersService,
    private notificationsService: NotificationService,
    private notificationGateway: NotificationGateway,
  ) {}

  async create(
    user: User,
    appointmentDTO: AppointmentDTO & { arrivalTime: string; endTime: string },
  ) {
    if (appointmentDTO.fName || appointmentDTO.phone) {
      /* Save user name and phone */
      user.fName = appointmentDTO?.fName || user.fName;
      user.phone = appointmentDTO.phone;
      await user.save();
    }

    const { salon } = await this.salonService.findById(appointmentDTO.salon);

    if (salon) {
      /* Create appointment */
      const appointment = await this.appointmentModel.create({
        ...appointmentDTO,
        customer: user.id,
        status: AppointmentStatusEnum.approved,
        salon: {
          id: salon.id,
          adminId: salon.admin,
          name: salon.name,
          address: salon.address,
          city: salon.city,
        },
      });

      /* Salon or Private Worker */
      let serviceOwner: Salon | PrivateWorker | undefined = undefined;

      /* Base response object */
      const response: CreateAppointmentResponse = {
        id: appointment._id.toString(),
        joinTime: dayjs(appointment.createdAt).format('hh:mm A'),
        arrivalTime: dayjs(appointment.arrivalTime).format('hh:mm A'),
        queuePosition: 0,
      };

      /* Private worker owner */
      if (appointmentDTO.privateWorkerId) {
        const { privateWorker } = await this.privateWorkerService.findById(
          appointmentDTO.privateWorkerId,
        );
        if (privateWorker) {
          privateWorker.appointments.push(appointment._id);
          await privateWorker?.save();

          const privateWorkerAppointments = (
            await privateWorker?.populate<{ appointments: Appointment[] }>(
              'appointments',
            )
          ).appointments!;

          /* Get appointments with status "pending" or "approved" for queue position */
          response.queuePosition = privateWorkerAppointments.filter(
            filterActiveAppointments,
          ).length;

          serviceOwner = privateWorker;
        }
      } else {
        /* Salon owner */
        salon.appointments.push(appointment._id);
        await salon?.save();

        const salonAppointments = (
          await salon?.populate<{ appointments: Appointment[] }>('appointments')
        ).appointments!;

        /* Get appointments with status "pending" or "approved" for queue position */
        response.queuePosition = salonAppointments.filter(
          filterActiveAppointments,
        ).length;
        serviceOwner = salon;
      }

      appointment.queuePosition = response.queuePosition;
      await appointment.save();

      const publicAppointment = appointment.toPublic();
      /* Create customer notification for new appointment event */
      const customerNotification = await this.notificationsService.create(
        publicAppointment,
        NotificationsType.APPOINTMENT_CREATED,
        RolesEnum.customer,
      );

      if (customerNotification.id) {
      }
      this.notificationGateway.emitNotificationCreate(user.id);

      if (serviceOwner) {
        /* Create customer notification for new appointment event */
        const serviceOwnerNotification = await this.notificationsService.create(
          publicAppointment,
          NotificationsType.APPOINTMENT_CREATED,
          RolesEnum.salon,
        );

        if (serviceOwnerNotification.id) {
          const ownerId =
            'admin' in serviceOwner
              ? serviceOwner.admin
              : serviceOwner.user._id;

          this.notificationGateway.emitNotificationCreate(ownerId.toString());
        }
      }

      return { appointment: response };
    } else {
      return throwHttpException(
        [BaseErrors.BAD_REQUEST],
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async delete(appointmentId: string) {
    /* Get targeted appointment */
    const appointment = await this.appointmentModel.findById(appointmentId);
    if (!appointment) return { errors: [BaseErrors.BAD_REQUEST] };
    else {
      /* Create generic apoointment owner variable */
      let appointmentOwner: Salon | PrivateWorker;

      /* Get private worker if this appointment belong to the private worker */
      if (appointment.privateWorkerId) {
        const { privateWorker } = await this.privateWorkerService.findById(
          appointment.privateWorkerId,
        );

        if (!privateWorker) return { errors: [BaseErrors.BAD_REQUEST] };

        appointmentOwner = privateWorker;
      } else {
        /* Get salon if this appointment belong to the salon */
        const { salon } = await this.salonService.findById(
          appointment.salon.id,
        );

        if (!salon) return { errors: [BaseErrors.BAD_REQUEST] };

        appointmentOwner = salon;
      }

      /* Exclude current appointment from the appointments list */
      const updatedAppointments = appointmentOwner.appointments.filter(
        (a) => a._id.toString() !== appointmentId,
      );
      appointmentOwner.appointments = updatedAppointments;

      /* Save updated appointments list */
      await appointmentOwner.save();
    }

    const response = await this.appointmentModel.deleteOne({
      _id: appointmentId,
    });
    if (response.deletedCount) {
      return { message: 'success' };
    } else {
      {
        errors: ['Delete appointment failed. Try later'];
      }
    }
  }

  async getStatusData(
    user: User,
    appointmentId: string,
  ): Promise<
    | {
        appointment: AppointmentStatus;
      }
    | { errors: [string] }
  > {
    /* Get targeted appointment */
    const appointment = await this.appointmentModel.findOne({
      _id: appointmentId,
      customer: user.id,
    });
    if (!appointment) return { errors: [BaseErrors.BAD_REQUEST] };
    else {
      /* Get targeted salon */
      const { salon } = await this.salonService.findById(appointment.salon.id);
      if (!salon) return { errors: [BaseErrors.BAD_REQUEST] };

      const waitTimeInMinutes = dayjs(appointment.arrivalTime).diff(
        dayjs(),
        'minute',
      );

      /* Create base response object */
      const response: AppointmentStatus = {
        id: appointment._id.toString(),
        joinTime: dayjs(appointment.createdAt).format('hh:mm A'),
        arrivalTime: dayjs(appointment.arrivalTime).format(
          'MM/DD/YYYY HH:mm:ss',
        ),
        salonName: salon.name,
        waitTimeInMinutes: waitTimeInMinutes > 0 ? waitTimeInMinutes : 0,
      };

      if (appointment.privateWorkerId) {
        /* Get populated private workers */
        const privateWorkers = (
          await salon.populate<{ privateWorkers: PrivateWorkerInterface[] }>(
            'privateWorkers',
          )
        ).privateWorkers;

        const privateWorker = privateWorkers.find(
          (p) => p.id === appointment.privateWorkerId,
        )!;

        response.privateWorkerName = privateWorker.user.fName;
      }

      return {
        appointment: response,
      };
    }
  }

  // Update Appointment
  async update(appointmentId: string, sourceAppointment: Partial<Appointment>) {
    const appointment = await this.appointmentModel.findOneAndUpdate(
      {
        _id: appointmentId,
      },
      sourceAppointment,
    );
    return { appointment: appointment?.toJSON() };
  }

  /* Get appointments by status */
  async getAppointmentsByStatus(
    user: User,
    filters: typeof ApiRoutes.appointments.getAppointmentsByStatus.getOptions.body,
  ) {
    const { status, salonId } = filters;

    let appointments: DashboardAppointment[] | [] = [];

    let groupedAppointments:
      | (
          | {
              salon: { id: string; name: string };
              appointment: DashboardAppointment;
            }
          | undefined
        )[]
      | null = null;

    let salonName: string = '';

    /* Private worker appointments */
    if (user.role === RolesEnum.privateWorker) {
      const { privateWorker } = await this.privateWorkerService.findById(
        user.privateWorkerId!,
      );
      if (privateWorker) {
        const populatedPrivateWorker = await privateWorker?.populate<{
          appointments: Appointment[];
          salon: Salon;
        }>('appointments salon');

        salonName = populatedPrivateWorker?.salon.name + ' (personal stylist)';

        appointments = populatedPrivateWorker.appointments
          .filter(
            (a) =>
              dayjs(a.endTime).utc().isAfter(dayjs().utc()) &&
              a.status === status,
          )
          .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
          .map((a) => normalizeAppointment(a.toPublic()));
      } else {
        return throwHttpException(
          [BaseErrors.BAD_REQUEST],
          HttpStatus.BAD_REQUEST,
        );
      }
    } else {
      const { salons } = await this.salonService.getSalonsByAdminId(user.id);

      if (!salonId) {
        /* Get appointments grouped by salon */
        groupedAppointments = salons
          .filter((s) => s.appointments.length)
          .map((s) => {
            const firstAppointmentIndex = s.appointments
              .filter((a) => dayjs(a.endTime).utc().isAfter(dayjs().utc()))
              .sort((a, b) => (a.createdAt > b.createdAt ? 1 : -1))
              .findIndex((a) => a.status === status);
            if (firstAppointmentIndex === -1) return;
            return {
              salon: {
                id: s.id,
                name: s.name,
              },
              appointment: normalizeAppointment(
                s.appointments[firstAppointmentIndex]?.toPublic(),
              ),
            };
          });
      } else {
        /* Get appointments for the single salon */
        const salon = salons.find((s) => s.id === salonId);

        if (salon) {
          await salon?.populate<{
            appointments: Appointment[];
          }>({ path: 'appointments' });

          salonName = salon.name;

          appointments = salon.appointments
            .filter(
              (a) =>
                dayjs(a.endTime).utc().isAfter(dayjs().utc()) &&
                a.status === status,
            )
            .map((a) => normalizeAppointment(a.toPublic()));
        }
      }
    }

    return {
      appointments: { salonName, list: appointments },
      groupedAppointments,
    };
  }

  async find(filters: any = {}) {
    return this.appointmentModel.find(filters);
  }

  async bulkCheckIn(user: User, appointmentsId: string[]) {
    try {
      const res = await this.appointmentModel.updateMany(
        {
          _id: {
            $in: appointmentsId,
          },
          'salon.adminId': user.id,
        },
        { status: AppointmentStatusEnum.checkedIn },
      );

      if (res.modifiedCount) {
        return { modifiedCount: res.modifiedCount };
      } else {
        throwHttpException(
          ['Something goes wrong. Try again'],
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch {
      throwHttpException(
        ['Something goes wrong. Try again'],
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
