import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import dayjs from 'dayjs';

import {
  AdminWidgets,
  CustomerDashboardSalon,
  PublicSalon,
  Salon as SalonInterface,
} from '@repo/shared/interfaces/salon';
import { PrivateWorker } from '@repo/shared/interfaces/salon/privateWorker';
import { AppointmentStatusEnum } from '@repo/shared/enums';
import { DashboardAppointment } from '@repo/shared/interfaces/appointment';

import { Salon, SalonModel } from '@/mongo/schemas/Salon/salon.schema';
import { Appointment } from '@/mongo/schemas/Appointment/appointment.schema';
import { User } from '@/mongo/schemas/User/user.schema';

import { normalizeAppointment } from '@/common/utils';
import { throwHttpException } from '@/common/guards/utils';
import { BaseErrors } from '@/common/constants';

import { NotificationService } from '@/notification/notification.service';

import { CreateSalonDTO } from './dto/create-salon.dto';

@Injectable()
export class SalonService {
  constructor(
    @InjectModel(Salon.name) private salonModel: SalonModel,
    @InjectModel(Appointment.name) private appointmentModel: SalonModel,
    private notificationService: NotificationService,
  ) {}

  // Create new Salon
  async create(
    createSalonDTO: CreateSalonDTO,
    userId: string,
  ): Promise<{ salon: PublicSalon }> {
    const salon = await this.salonModel.create({
      ...createSalonDTO,
      admin: new Types.ObjectId(userId),
    });

    const publicSalon = salon.toPublic();

    return { salon: publicSalon };
  }

  // Get all salons
  async findAll() {
    return this.salonModel.find({});
  }

  //   Find salon by its id
  async findById(salonId: string | Types.ObjectId) {
    const salon = await this.salonModel.findOne({ _id: salonId });
    return { salon };
  }

  //   Get salon dashboard data for owner
  async getSalonDashboard(user: User, salonId: string | Types.ObjectId) {
    const { salons } = await this.getSalonsByAdminId(user.id);

    const salon = salons.find((s) => s.id === salonId);

    /* Populate appointments */
    const populatedSalon = await salon!.populate<{
      appointments: Appointment[];
    }>('appointments');

    const appointments = populatedSalon.appointments.filter((a) =>
      dayjs(a.endTime).utc().isAfter(dayjs().utc()),
    );

    /* Filter appointments by status */
    const firstApprovedRequest = appointments.find(
      (a) => a.status === AppointmentStatusEnum.approved,
    );

    if (firstApprovedRequest) {
      /* Populate customer */
      const appointment = await firstApprovedRequest.populate<{
        customer: User;
      }>('customer');

      const firstApprovedAppointment = normalizeAppointment(
        appointment.toPublic(),
      );

      return {
        salon: populatedSalon.toPublic(),
        firstApprovedAppointment,
      };
    }

    return {
      salon,
      firstAppointment: null,
    };
  }

  // Gqt all salons by Admin ID
  async getSalonsByAdminId(adminId: string) {
    const salons = await this.salonModel
      .find({
        admin: { $eq: adminId },
      })
      .populate<{ appointments: Appointment[] }>({
        path: 'appointments',
      });

    /* Get first "pending" request */
    let firstUpcomingAppointment: DashboardAppointment;

    const upcomingAppointments = await this.appointmentModel
      .find<Appointment>({
        status: AppointmentStatusEnum.pending,
        privateWorkerId: { $exists: false },
        'salon.adminId': { $eq: adminId },
        endTime: { $gt: dayjs().utc().toDate() },
      })
      .sort({ createdAt: 1 })
      .limit(1)
      .exec();

    if (upcomingAppointments[0]?.id) {
      const appointment = upcomingAppointments[0].toPublic();

      firstUpcomingAppointment = normalizeAppointment(appointment);
      return {
        salons,
        firstUpcomingAppointment,
      };
    }

    return {
      salons,
    };
  }

  // Get Admin Dashboard
  async getAdminDashboard(adminId: string) {
    try {
      const { salons } = await this.getSalonsByAdminId(adminId);

      const widgetsData: AdminWidgets = {
        totalSalons: salons.length || 0,
        activeQueues: 0,
        totalCustomers: 0,
      };

      /* Get widgets data */

      /* Active queues */
      widgetsData.activeQueues = salons.reduce((prev: number, curr) => {
        const hasApproved = curr.appointments.some(
          (a) => a.status === AppointmentStatusEnum.approved,
        );
        if (hasApproved) prev++;
        return prev;
      }, 0);

      /* Get "pending" and "approved" appointments  */
      const appointments = await this.appointmentModel.find<Appointment>({
        status: {
          $nin: [AppointmentStatusEnum.declined, AppointmentStatusEnum.missed],
        },
        'salon.adminId': { $eq: adminId },
        privateWorkerId: { $exists: false },
      });
      /* Total customers */
      widgetsData.totalCustomers = appointments.reduce(
        (prev: number, { status }) => {
          if (
            status === AppointmentStatusEnum.approved ||
            status === AppointmentStatusEnum.completed
          )
            prev++;

          return prev;
        },
        0,
      );

      /* Get first "pending" request */
      let firstUpcomingAppointment: DashboardAppointment;

      const upcomingAppointments = await this.appointmentModel
        .find<Appointment>({
          status: AppointmentStatusEnum.pending,
          privateWorkerId: { $exists: false },
          'salon.adminId': { $eq: adminId },
        })
        .sort({ createdAt: 1 })
        .limit(1)
        .exec();

      if (upcomingAppointments[0]?.id) {
        const appointment = upcomingAppointments[0].toPublic();

        firstUpcomingAppointment = normalizeAppointment(appointment);

        return {
          widgetsData,
          firstUpcomingAppointment,
        };
      }

      return {
        widgetsData,
      };
    } catch (e) {
      throwHttpException([BaseErrors.DEFAULT], HttpStatus.BAD_GATEWAY);
    }
  }

  /* Get salons for the customer salons list dashboard */
  async getSalonsForCustomer(search: string, waitTime: string) {
    if (waitTime && isNaN(Number(waitTime))) {
      throwHttpException(['Bad filters'], HttpStatus.BAD_REQUEST);
    }
    // user: User
    const salonsResp: Salon[] = await this.salonModel.find({
      $or: [
        {
          services: {
            $exists: true,
            $ne: [],
          },
        },
        {
          privateWorkers: {
            $exists: true,
            $ne: [],
          },
          'privateWorkers.services': {
            $ne: [],
          },
        },
      ],
    });

    /* Salons result */
    const salons = [] as unknown as SalonInterface &
      {
        services: { id: string; name: string; duration: number }[];
        privateWorkerName?: string;
        privateWorkerId?: string;
      }[];

    salonsResp.forEach(
      ({
        id,
        name,
        city,
        address,
        closestTimeToAppointment,
        services,
        privateWorkers,
      }) => {
        /* Base data fields for salon or private worker */
        const baseSalonObject: CustomerDashboardSalon = {
          id,
          name,
          city,
          address,
          services: [],
          waitTimeInMinutes: 0,
        };
        /* If closest appointment time exists */
        if (closestTimeToAppointment) {
          /* Difference between current time and closest apoointment time */
          const waitTimeInMinutes = dayjs(closestTimeToAppointment).diff(
            dayjs(),
            'minute',
          );

          if (waitTimeInMinutes > 0) {
            /* If closest appointment time is not passed */
            baseSalonObject.waitTimeInMinutes = waitTimeInMinutes;
            baseSalonObject.freeSeatsAvailable = false;
          } else {
            baseSalonObject.freeSeatsAvailable = true;
            baseSalonObject.waitTimeInMinutes = 0;
          }
        } else {
          baseSalonObject.freeSeatsAvailable = true;
          baseSalonObject.waitTimeInMinutes = 0;
        }
        /* Normalizw salon services */
        const salonServices = services.map((s) => ({
          id: s.id,
          name: s.name,
          duration: s.estimatedDuration,
        }));

        if (salonServices.length) {
          const responseObj = {
            ...baseSalonObject,
            services: salonServices,
          };

          /* Handle search */
          if (search) {
            if (
              [name.toLowerCase(), city.toLowerCase(), address.toLowerCase()]
                .join(',')
                .includes(search.toLowerCase()) ||
              salonServices.some((s) =>
                s.name.toLowerCase().includes(search.toLowerCase()),
              )
            ) {
              salons.push(responseObj);
            }
          } else if (waitTime) {
            if (responseObj.waitTimeInMinutes <= +waitTime) {
              salons.push(responseObj);
            }
          } else {
            /* Push to the salons result */
            salons.push(responseObj);
          }
        }
        /* Handle salon private workers */
        privateWorkers.forEach((p) => {
          const worker = p as unknown as PrivateWorker;

          /* If closest appointment time exists */
          if (worker.closestTimeToAppointment) {
            /* Difference between current time and closest apoointment time */
            const waitTimeInMinutes = dayjs(worker.closestTimeToAppointment)
              .utc()
              .diff(dayjs().utc(), 'minute');

            if (waitTimeInMinutes > 0) {
              /* If closest appointment time is not passed */

              baseSalonObject.waitTimeInMinutes = waitTimeInMinutes;
              baseSalonObject.freeSeatsAvailable = false;
            } else {
              baseSalonObject.freeSeatsAvailable = true;
              baseSalonObject.waitTimeInMinutes = 0;
            }
          } else {
            /* If closest appointment time is passed */
            baseSalonObject.freeSeatsAvailable = true;
            baseSalonObject.waitTimeInMinutes = 0;
          }
          /* Handle salon private worker services */
          if (worker.services.length) {
            /* Normalize private worker services as salon services structure */
            const privateWorkerServices = worker.services.map((serv) => ({
              id: serv.id,
              name: serv.name,
              duration: serv.estimatedDuration,
            }));

            const responseObj = {
              ...baseSalonObject,
              privateWorkerName: worker.user.fName,
              privateWorkerId: worker.id,
              services: privateWorkerServices,
            };

            /* Handle search */
            if (search) {
              if (
                [
                  worker.user.fName!.toLowerCase(),
                  address.toLowerCase(),
                  city.toLowerCase(),
                ]
                  .join(',')
                  .includes(search.toLowerCase()) ||
                privateWorkerServices.some(
                  (s) =>
                    s.name.toLowerCase().includes(search.toLowerCase()) ||
                    name.toLowerCase().includes(search.toLowerCase()),
                )
              ) {
                salons.push(responseObj);
              }
            } else if (waitTime) {
              if (responseObj.waitTimeInMinutes <= +waitTime) {
                salons.push(responseObj);
              }
            } else {
              /* Push to the salons result */
              salons.push(responseObj);
            }
          }
        });
      },
    );

    return {
      salons,
    };
  }

  /* Update salon */
  async update(
    user: User,
    salonId: string,
    updateSalonDto: Partial<CreateSalonDTO>,
  ) {
    const salon = await this.salonModel.findOne({
      _id: salonId,
      admin: { $eq: user.id },
    });
    if (!salon) {
      return { errors: 'Salon not found' };
    }
    Object.assign(salon, updateSalonDto);

    await salon.save();

    return { salon: salon.toPublic() };
  }
}
