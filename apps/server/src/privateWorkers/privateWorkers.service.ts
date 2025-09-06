import { Types } from 'mongoose';
import { ConflictException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';

import {
  AppointmentStatusEnum,
  AuthProvidersEnum,
  RolesEnum,
} from '@repo/shared/enums';
import {
  DashboardAppointment,
  Appointment as AppointmentInterface,
} from '@repo/shared/interfaces/appointment';

import { throwHttpException } from '@/common/guards/utils';
import { BaseErrors } from '@/common/constants';
import { normalizeAppointment } from '@/common/utils';

import { UserService } from '@/user/user.service';
import { NotificationService } from '@/notification/notification.service';
import { Salon, SalonModel } from '@/mongo/schemas/Salon/salon.schema';
import {
  PrivateWorker,
  PrivateWorkerModel,
} from '@/mongo/schemas/PrivateWorker/privateWorker.schema';

import { AddPrivateWorkerDTO } from './dto/add-privateWorker.dto';
import {
  Appointment,
  AppointmentModel,
} from '@/mongo/schemas/Appointment/appointment.schema';

@Injectable()
export class PrivateWorkersService {
  constructor(
    @InjectModel(Salon.name) private salonModel: SalonModel,
    @InjectModel(PrivateWorker.name)
    private privateWorkerModel: PrivateWorkerModel,
    @InjectModel(Appointment.name)
    private appointmentModel: AppointmentModel,
    private userService: UserService,
    private notificationService: NotificationService,
  ) {}

  // Add new private worker
  async create(
    userId: string,
    salonId: string,
    addPrivateWorkerDTO: AddPrivateWorkerDTO,
  ) {
    const salon = await this.salonModel.findOne({
      _id: salonId,
      admin: userId,
    });

    if (!salon) {
      throwHttpException([BaseErrors.UNAUTHORIZED], HttpStatus.BAD_REQUEST);
    } else {
      const existedUser = await this.userService.findByEmailOrPhone(
        addPrivateWorkerDTO.email,
      );

      if (existedUser) {
        throw new ConflictException({
          errors: [`Email already exists`],
        });
      }

      const user = await this.userService.create({
        authProvider: AuthProvidersEnum.EMAIL,
        authValue: addPrivateWorkerDTO.email,
        role: RolesEnum.privateWorker,
        fName: addPrivateWorkerDTO.name,
        tempPassword: addPrivateWorkerDTO.tempPassword,
      });

      const privateWorker = await this.privateWorkerModel.create({
        user: user.id,
        salon: salon.id,
      });

      salon.privateWorkers.push(privateWorker._id);

      await salon?.save();

      user.privateWorkerId = privateWorker.id;
      await user.save();

      return { salon };
    }
  }

  /* Get all private workers */
  async getAll(adminId: string, salonId: string) {
    const dbResponse = await this.salonModel.findOne(
      {
        _id: salonId,
        admin: adminId,
      },
      { privateWorkers: 1 },
    );
    await dbResponse?.populate('privateWorkers.user', 'fName');
    const response = dbResponse?.toJSON();

    return { ...response };
  }

  /* Delete private worker member by id */
  async delete(salonId: string, workerId: string) {
    const salon = await this.salonModel.findOne({ _id: salonId });

    if (salon) {
      const pwResp = await this.privateWorkerModel.deleteOne({ _id: workerId });

      if (pwResp) {
        const privateWorkers = salon.privateWorkers?.filter(
          (w) => w._id.toString() !== workerId,
        );

        Object.assign(salon, { privateWorkers });
        await salon.save();

        return {
          privateWorkers,
        };
      } else return null;
    }
  }

  //   Find private worker dashboard
  async getPrivateWorkerDasdboard(privateWorkerId: string) {
    const privateWorker = await this.privateWorkerModel
      .findById(privateWorkerId, { createdAt: 0, updatedAt: 0 })
      .populate<{ salon: Salon }>('salon', {
        name: 1,
        address: 1,
        appointments: 0,
        privateWorkers: 0,
      });

    if (privateWorker) {
      const salon = privateWorker.salon;
      salon.services = privateWorker.services;

      const appointments = (
        await privateWorker.populate<{ appointments: AppointmentInterface[] }>(
          'appointments',
        )
      ).appointments.filter((a) =>
        dayjs(a.endTime).utc().isAfter(dayjs().utc()),
      );

      let firstApprovedAppointment: DashboardAppointment | null = null;
      let firstUpcomingAppointment: DashboardAppointment | null = null;

      const approvedAppointment = appointments.find(
        (a) => a.status === AppointmentStatusEnum.approved,
      );
      const upcomingRequestIndex = appointments.findIndex(
        (a) => a.status === AppointmentStatusEnum.pending,
      );

      if (approvedAppointment) {
        firstApprovedAppointment = normalizeAppointment(approvedAppointment);
      }

      if (upcomingRequestIndex > -1) {
        const upcomingRequest = appointments[upcomingRequestIndex];

        firstUpcomingAppointment = normalizeAppointment(upcomingRequest);
      }
      const widgetsData = {
        customersWaiting: 0,
        totalCustomers: 0,
      };

      /* Get widgets data */
      const result = appointments.reduce(
        (
          prev: Record<'customersWaiting' | 'totalCustomers', number>,
          { status },
        ) => {
          if (status === AppointmentStatusEnum.approved)
            prev.customersWaiting += 1;
          if (status === AppointmentStatusEnum.completed)
            prev.totalCustomers += 1;
          return prev;
        },
        { customersWaiting: 0, totalCustomers: 0 },
      );

      Object.assign(widgetsData, { ...result });

      return {
        salon: { ...salon.toPublic(), appointments },
        widgetsData,
        firstApprovedAppointment,
        firstUpcomingAppointment,
      };
    }
  }

  //   Find private worker by id
  async findById(privateWorkerId: string) {
    const privateWorker =
      await this.privateWorkerModel.findById(privateWorkerId);

    return { privateWorker };
  }

  // Get private worker admin Dashboard
  async getPrivateWorkerAdminDashboard(privateWorkerId: string) {
    const widgetsData = {
      activeQueues: 0,
      totalCustomers: 0,
    };

    /* Get "pending" and "approved" appointments  */
    const apps = await this.appointmentModel
      .find<AppointmentInterface>({
        status: {
          $nin: [AppointmentStatusEnum.declined, AppointmentStatusEnum.missed],
        },
      })
      .populate({
        path: 'salon',
        match: {
          privateWorkerId: { $eq: new Types.ObjectId(privateWorkerId) },
        },
      })
      .exec();

    /* Get widgets data */
    const result = apps.reduce(
      (prev: Record<'activeQueues' | 'totalCustomers', number>, { status }) => {
        if (status === AppointmentStatusEnum.approved) prev.activeQueues += 1;
        if (status === AppointmentStatusEnum.completed)
          prev.totalCustomers += 1;
        return prev;
      },
      { activeQueues: 0, totalCustomers: 0 },
    );

    Object.assign(widgetsData, { ...result });

    /* Get first "pending" request */
    let firstUpcomingRequest: DashboardAppointment;

    const upcomingAppointments = await this.appointmentModel
      .find<Appointment>({
        status: AppointmentStatusEnum.pending,
      })
      .populate({
        path: 'salon',
        match: {
          privateWorkerId: { $eq: new Types.ObjectId(privateWorkerId) },
          endTime: { $gte: dayjs().utc() },
        },
      })
      .sort({ createdAt: 1 })
      .limit(1)
      .exec();

    if (upcomingAppointments[0]?.id) {
      const appointment = upcomingAppointments[0].toPublic();

      firstUpcomingRequest = normalizeAppointment(appointment);

      return { widgetsData, firstUpcomingRequest };
    }
    return { widgetsData };
  }
}
