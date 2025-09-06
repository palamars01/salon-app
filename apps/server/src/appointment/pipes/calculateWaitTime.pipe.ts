import {
  Injectable,
  PipeTransform,
  Scope,
  Inject,
  Request,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import minMax from 'dayjs/plugin/minMax';
dayjs.extend(utc);
dayjs.extend(minMax);

import { AppointmentDTO } from '../dto/appointment.dto';
import { SalonService } from '@/salon/salon.service';

import { PrivateWorkersService } from '@/privateWorkers/privateWorkers.service';
import { Appointment } from '@/mongo/schemas/Appointment/appointment.schema';

@Injectable({ scope: Scope.REQUEST })
export class CalculateWaitTimePipe implements PipeTransform {
  constructor(
    @Inject(REQUEST) protected readonly req: Request,
    private salonService: SalonService,
    private privateWorkerService: PrivateWorkersService,
  ) {}
  async transform(createAppointmentDTO: AppointmentDTO) {
    if (typeof createAppointmentDTO === 'string') {
      return createAppointmentDTO;
    }

    const { privateWorkerId, salon: salonId, services } = createAppointmentDTO;

    const totalServicesDuration = services.reduce(
      (prev, curr) => prev + curr.duration,
      0,
    );
    let arrivalTime: dayjs.Dayjs = dayjs();
    let endTime: Date = dayjs().toDate();

    /* FOR PRIVATE WORKER */
    if (privateWorkerId) {
      const { privateWorker } =
        await this.privateWorkerService.findById(privateWorkerId);
      if (privateWorker) {
        const { closestTimeToAppointment } = privateWorker;

        if (
          /* Closest appointment time not exists */
          !closestTimeToAppointment ||
          /* Closest appointment time is passed */
          dayjs(closestTimeToAppointment).isBefore(dayjs())
        ) {
          arrivalTime = dayjs();
        } else {
          /* Closest appointment time is not passed */
          arrivalTime = dayjs(closestTimeToAppointment);
        }
        endTime = dayjs(arrivalTime)
          .add(totalServicesDuration, 'minute')
          .utc()
          .toDate();

        privateWorker.closestTimeToAppointment = endTime;
        await privateWorker.save();
      }
    } else {
      /* FOR SALON */

      /* Get target salon */
      const { salon } = await this.salonService.findById(salonId);

      if (salon) {
        /* Populate salon appointments */
        const populatedSalon = await salon.populate<{
          appointments: Appointment[];
        }>('appointments', { endTime: 1, customer: 0, _id: 0 });

        /* Get appointments end time */
        const endT = populatedSalon.appointments.map((a) => a.endTime);

        /* Filter appointments end time: should be greater than existed closest time to appointment as well as current time */
        let endTimes = endT.filter((t) =>
          dayjs(t)
            .utc()
            .isAfter(
              dayjs
                .max(dayjs(salon.closestTimeToAppointment).utc(), dayjs().utc())
                .utc(),
            ),
        );

        /* Filter appointments with future end time */
        const running = endT.filter((t) =>
          dayjs(t).utc().isAfter(dayjs().utc()),
        );

        /* If appointments with future end time count less then the salon employees, we have free employee */
        if (running.length < salon.employees) {
          arrivalTime = dayjs();
        } else {
          arrivalTime = dayjs(salon.closestTimeToAppointment);

          /* Exclude current closest time, because we set new appointment for this time */
          endTimes = endTimes.filter(
            (t) => t !== salon.closestTimeToAppointment,
          );
        }

        /* Calculate appointment end time */
        endTime = dayjs(arrivalTime)
          .add(totalServicesDuration, 'minute')
          .utc()
          .toDate();

        /* Push current appointment end time for new closest time calculation */
        endTimes.push(endTime);

        if (endTimes.length >= salon.employees) {
          /* Get closest appointment end time */
          const closestTimeToAppointment = dayjs
            .min(endTimes.map((d) => dayjs(d)))!
            .utc()
            .toDate();
          salon.closestTimeToAppointment = closestTimeToAppointment;
          await salon.save();
        } else {
          salon.closestTimeToAppointment = undefined;
          await salon.save();
        }
      }
    }

    return {
      ...createAppointmentDTO,
      arrivalTime: arrivalTime.utc().toDate(),
      endTime,
    };
  }
}
