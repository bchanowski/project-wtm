import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { from, Observable } from 'rxjs';
import { HOEntity } from './models/homeoffice.entity';
import { Homeoffice_days } from './models/homeoffice.interface';

@Injectable()
export class HomeofficeService {
  constructor(
    @InjectRepository(HOEntity)
    private HomeofficeRepository: Repository<HOEntity>,
  ) {}

  // Bartek
  newHomeofficeDay(homeoffice: Homeoffice_days): Observable<Homeoffice_days> {
    try {
      return from(this.HomeofficeRepository.save(homeoffice));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error_mess: "Couldn't create new day",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async addNewRemoteDay(homeOffice: Homeoffice_days) {
    console.log(homeOffice);
    try {
      const currentTimestamp = new Date().setHours(23, 59, 59, 0);
      const enteredTimestamp = new Date(homeOffice.date).getTime();

      const currentDate = new Date(
        new Date().setUTCHours(new Date().getUTCHours() + 2),
      );
      const firstFilteredDay = new Date(currentDate.setHours(0, 0, 0, 0));
      const numberOfDays = 5;
      const firstFilteredDayString = firstFilteredDay
        .toISOString()
        .slice(0, 10);
      const lastFilteredDayString = new Date(
        currentDate.setDate(new Date().getDate() + numberOfDays),
      )
        .toISOString()
        .slice(0, 10);

      if (currentTimestamp - enteredTimestamp > 0)
        throw {
          message:
            'Dzień zdalny nie może być w przeszłości lub w dniu tworzenia',
        };

      const duplicates = await this.HomeofficeRepository.find({
        where: {
          date: homeOffice.date,
          user_id_fk: { user_id: homeOffice.user_id_fk.user_id },
        },
      });

      if (duplicates.length)
        throw {
          message: 'W wybranym dniu jest już zapisany dzień zdalny',
        };

      const homeOfficeToSave = {
        date: homeOffice.date,
        conversation: 'Lista zdalnej pracy',
        user_id_fk: {
          user_id: homeOffice.user_id_fk.user_id,
        },
      };
      await this.HomeofficeRepository.save(homeOfficeToSave);

      const remoteDays = await this.HomeofficeRepository.find({
        where: {
          user_id_fk: { user_id: homeOffice.user_id_fk.user_id },
          date: Between(firstFilteredDayString, lastFilteredDayString),
        },
        order: { date: 'ASC' },
        relations: ['user_id_fk'],
      });

      return remoteDays;
    } catch (err) {
      throw err;
    }
  }

  async updateRemoteDay(homeOffice: Homeoffice_days) {
    try {
      const { homeoffice_id } = homeOffice;

      const currentDate = new Date(
        new Date().setUTCHours(new Date().getUTCHours() + 2),
      );

      const currentDayEnd = currentDate.setHours(23, 59, 59, 999);
      const enteredTimestamp = new Date(homeOffice.date).getTime();

      const currentDateString = currentDate.toISOString().slice(0, 10);

      const homeOfficeToEdit = await this.HomeofficeRepository.findOne({
        where: { homeoffice_id: homeoffice_id },
      });

      if (!homeOfficeToEdit)
        throw {
          code: 404,
          message: 'Nie znaleziono dnia zdalnego o podanym ID',
        };

      if (homeOfficeToEdit.date === currentDateString)
        throw {
          code: 404,
          message: 'Nie można edytować dnia zdalnego, który trwa',
        };

      if (currentDayEnd > enteredTimestamp)
        throw {
          message:
            'Dzień zdalny nie może być w przeszłości lub w dniu tworzenia',
        };

      const duplicates = await this.HomeofficeRepository.find({
        where: {
          date: homeOffice.date,
          user_id_fk: homeOffice.user_id_fk,
        },
      });

      if (duplicates?.length)
        throw {
          message: 'W wybranym dniu jest już zapisany dzień zdalny',
        };

      const updatedRemoteDay = await this.HomeofficeRepository.update(
        homeoffice_id,
        homeOffice,
      );
      if (+updatedRemoteDay.affected === 0)
        throw {
          message: 'Wystąpił błąd podczas edytowania dnia zdalnego',
        };

      const remoteDays = await this.HomeofficeRepository.find({
        where: {
          user_id_fk: homeOffice.user_id_fk,
        },
        order: { date: 'ASC' },
        relations: ['user_id_fk'],
      });

      return remoteDays;
    } catch (err) {
      throw err;
    }
  }

  async removeRemoteDay(data) {
    try {
      const homeOfficeToDelete = await this.HomeofficeRepository.findOne({
        where: { homeoffice_id: data.id },
      });

      if (!homeOfficeToDelete)
        throw {
          code: 404,
          message: 'Nie znaleziono dnia zdalnego o podanym ID',
        };

      const currentDayTimeStamp = new Date(
        new Date().setUTCHours(new Date().getUTCHours() + 2),
      ).setHours(23, 59, 59, 999);

      const homeOfficeToDeleteTimestamp = new Date(
        homeOfficeToDelete.date,
      ).setHours(0, 0, 0, 0);

      if (homeOfficeToDeleteTimestamp <= currentDayTimeStamp)
        throw {
          message:
            'Nie można usuwać dni zdalnych z przeszłości lub tych, które trwają',
          code: 404,
        };

      const deletedHomeOffice = await this.HomeofficeRepository.delete(data.id);

      if (deletedHomeOffice.affected !== 1)
        throw {
          message: 'Wystąpił błąd podczas usuwania',
          code: 500,
        };

      const remoteDays = await this.HomeofficeRepository.find({
        where: {
          user_id_fk: data.user_id_fk,
        },
        order: { date: 'ASC' },
        relations: ['user_id_fk'],
      });

      return remoteDays;
    } catch (err) {
      throw err;
    }
  }

  findAllDays(): Observable<Homeoffice_days[]> {
    try {
      return from(
        this.HomeofficeRepository.find({
          order: { date: 'ASC' },
          relations: ['user_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users days",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findAllUserDays(checkId: number): Observable<Homeoffice_days[]> {
    try {
      return from(
        this.HomeofficeRepository.find({
          where: {
            user_id_fk: { user_id: checkId },
          },
          order: { date: 'ASC' },
          relations: ['user_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users days",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findUserAndDay(id: number, checkDate: string): Observable<Homeoffice_days[]> {
    try {
      return from(
        this.HomeofficeRepository.find({
          where: {
            date: checkDate,
            user_id_fk: { user_id: id },
          },
          relations: ['user_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users days",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findAllUsersOnDay(checkDate: string): Observable<Homeoffice_days[]> {
    try {
      return from(
        this.HomeofficeRepository.find({
          where: {
            date: checkDate,
          },
          relations: ['user_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users days",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findUserDateBetween(
    id: number,
    dateStart: string,
    dateEnd: string,
  ): Observable<Homeoffice_days[]> {
    try {
      return from(
        this.HomeofficeRepository.find({
          where: {
            date: Between(dateStart, dateEnd),
            user_id_fk: { user_id: id },
          },
          order: { date: 'ASC' },
          relations: ['user_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users days",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async filterRemoteDays(id, dateStart, dateEnd) {
    return await this.HomeofficeRepository.find({
      where: {
        date: Between(dateStart, dateEnd),
        user_id_fk: { user_id: id },
      },
      order: { date: 'ASC' },
      relations: ['user_id_fk'],
    });
  }

  updateHomeoffice(
    id: number,
    homeoffice: Homeoffice_days,
  ): Observable<UpdateResult> {
    try {
      return from(this.HomeofficeRepository.update(id, homeoffice));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_MODIFIED,
          error_mess: "Couldn't update the day",
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  deleteDay(id: number): Observable<DeleteResult> {
    try {
      return from(this.HomeofficeRepository.delete(id));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error_mess: "Couldn't delete homeoffice day",
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async deleteAllForUser(id: number) {
    const entities = await this.HomeofficeRepository.find({
      where: {
        user_id_fk: { user_id: id },
      },
      order: { date: 'ASC' },
      relations: ['user_id_fk'],
    });
    if (!entities) {
      throw new NotFoundException('Entities not found, no changes applied!');
    }
    return this.HomeofficeRepository.remove(entities);
  }
}
