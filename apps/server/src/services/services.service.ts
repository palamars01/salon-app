import { HttpStatus, Injectable } from '@nestjs/common';

import { RolesEnum } from '@repo/shared/enums';

import { throwHttpException } from '@/common/guards/utils';
import { BaseErrors } from '@/common/constants';

import { User } from '@/mongo/schemas/User/user.schema';
import {
  SalonServiceItem,
  SalonServiceModel,
} from '@/mongo/schemas/SalonService/salonService.schema';
import { ServiceDTO } from './dto/service.dto';
import { SalonService } from '../salon/salon.service';
import { PrivateWorkersService } from '../privateWorkers/privateWorkers.service';
import { Service } from '@repo/shared/interfaces/salon/service';
import { NotificationService } from '@/notification/notification.service';

@Injectable()
export class ServicesService {
  constructor(
    private salonService: SalonService,
    private privateWorkerService: PrivateWorkersService,
    private notificationService: NotificationService,
  ) {}

  // Get active services
  async getAll(user: User, salonId: string) {
    let services: Service[] = [];
    if (user.role === RolesEnum.salon) {
      const { salon } = await this.salonService.findById(salonId);
      if (!salon) {
        return throwHttpException(
          [BaseErrors.UNAUTHORIZED],
          HttpStatus.BAD_REQUEST,
        );
      }
      services = salon.services;
    } else {
      const { privateWorker } = await this.privateWorkerService.findById(
        user.privateWorkerId!,
      );
      if (!privateWorker) {
        return throwHttpException(
          [BaseErrors.UNAUTHORIZED],
          HttpStatus.BAD_REQUEST,
        );
      }
      services = privateWorker!.services;
    }

    return {
      services,
    };
  }
  // Get one service by id
  async getOneById(user: User, salonId: string, serviceId: string) {
    let services: SalonServiceItem[] = [];

    if (user.role === RolesEnum.salon) {
      const { salon } = await this.salonService.findById(salonId);
      if (!salon) {
        return throwHttpException(
          [BaseErrors.UNAUTHORIZED],
          HttpStatus.BAD_REQUEST,
        );
      }

      services = salon!.services;
    } else {
      const { privateWorker } = await this.privateWorkerService.findById(
        user.privateWorkerId!,
      );
      if (!privateWorker) {
        return throwHttpException(
          [BaseErrors.UNAUTHORIZED],
          HttpStatus.BAD_REQUEST,
        );
      }

      services = privateWorker!.services;
    }

    const service = services.find((s) => s.id === serviceId);

    return { service };
  }

  // Add new service
  async create(user: User, salonId: string, addServiceDto: ServiceDTO) {
    const service = new SalonServiceModel({
      ...addServiceDto,
      id: crypto.randomUUID(),
    });

    if (user.role === RolesEnum.salon) {
      /* Get targeted salon */

      const { salon } = await this.salonService.findById(salonId);

      if (!salon) {
        throwHttpException([BaseErrors.UNAUTHORIZED], HttpStatus.BAD_REQUEST);
      } else {
        salon.services.push(service);
        await salon.save();
        return { salon: salon?.toPublic() };
      }
    } else {
      const { privateWorker } = await this.privateWorkerService.findById(
        user.privateWorkerId!,
      );
      if (!privateWorker) {
        throwHttpException([BaseErrors.UNAUTHORIZED], HttpStatus.BAD_REQUEST);
      } else {
        privateWorker.services.push(service);
        await privateWorker.save();
        return { salon: privateWorker };
      }
    }
  }

  // Update Service
  async update(
    user: User,
    salonId: string,
    serviceId: string,
    sourceService: ServiceDTO,
  ) {
    if (user.role === RolesEnum.salon) {
      /* Get targeted salon */
      const { salon } = await this.salonService.findById(salonId);
      if (salon) {
        const services = salon.services.map((s) => {
          if (s.id === serviceId) return { ...sourceService, id: serviceId };
          else return s;
        });

        Object.assign(salon, { services });
        await salon.save();
        return {
          salon,
        };
      } else return null;
    } else {
      const { privateWorker } = await this.privateWorkerService.findById(
        user.privateWorkerId!,
      );
      if (privateWorker) {
        const services = privateWorker.services.map((s) => {
          if (s.id === serviceId) return { ...sourceService, id: serviceId };
          else return s;
        });

        Object.assign(privateWorker, { services });
        await privateWorker.save();
        return {
          salon: privateWorker,
        };
      } else return null;
    }
  }

  // Delete Service
  async delete(user: User, salonId: string, serviceId: string) {
    if (user.role === RolesEnum.salon) {
      /* Get targeted salon */
      const { salon } = await this.salonService.findById(salonId);

      if (salon) {
        const services = salon.services.filter((s) => s.id !== serviceId);
        Object.assign(salon, { services });
        await salon.save();

        return {
          services,
        };
      } else return null;
    } else {
      const { privateWorker } = await this.privateWorkerService.findById(
        user.privateWorkerId!,
      );
      if (privateWorker) {
        const services = privateWorker.services.filter(
          (s) => s.id !== serviceId,
        );
        Object.assign(privateWorker, { services });
        await privateWorker.save();

        return {
          services,
        };
      } else return null;
    }
  }
}
