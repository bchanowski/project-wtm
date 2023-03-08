import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceEntity } from '../models/service.entity';
import { Service } from '../models/service.interface';

@Injectable()
export class ServiceService {
  constructor(
    @InjectRepository(ServiceEntity)
    private readonly serviceRepository: Repository<ServiceEntity>,
  ) {}

  async getAllServices() {
    try {
      return await this.serviceRepository.find({
        relations: ['team_id'],
        order: { start_date: 'ASC' },
      });
    } catch (err) {
      throw { mesage: 'Wystąpił błąd podczas pobierania dyżurów', code: 404 };
    }
  }

  async updateService(service: Service) {
    try {
      return await this.serviceRepository.update(service.service_id, service);
    } catch (err) {
      throw { mesage: 'Wystąpił błąd podczas edytowania dyżuru', code: 404 };
    }
  }

  async deleteService(id: number) {
    try {
      const deletedService = await this.serviceRepository.delete(id);

      if (!deletedService.affected)
        throw { message: 'Błędne id dyżuru', code: 404 };
    } catch (err) {
      throw err;
    }
  }

  async createService(service: Service) {
    try {
      const shiftsOnChosenStartDate = await this.serviceRepository.find({
        select: ['service_id'],
        where: { start_date: service.start_date },
      });

      if (shiftsOnChosenStartDate.length)
        throw { message: 'W wybranym tygodniu istnieje już dyżur', code: 404 };

      const currentDate = Date.now();
      const endDateOfRequestedService = new Date(service.end_date).setHours(
        0,
        0,
        0,
        0,
      );

      const calcTimestamp = currentDate - endDateOfRequestedService;

      if (calcTimestamp > 0)
        throw { message: 'Nie można tworzyć dyżuru w przeszłości', code: 404 };

      const createdService = await this.serviceRepository.save(service);

      if (!createdService?.start_date || !createdService?.team_id)
        throw { mesage: 'Wystąpił błąd podczas tworzenia dyżuru', code: 404 };
    } catch (err) {
      throw err;
    }
  }
}
