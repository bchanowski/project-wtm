import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, Observable } from 'rxjs';
import { Between, Repository, LessThan } from 'typeorm';
import { WorkTimeEntity } from '../models/work-time.entity';
import { WorkTime } from '../models/work-time.interface';

@Injectable()
export class WorkTimeService {
  constructor(
    @InjectRepository(WorkTimeEntity)
    private readonly workTimeRepository: Repository<WorkTimeEntity>,
  ) {}

  async createWorkTime(workTime: WorkTime) {
    try {
      if (workTime.message == 'quit') {
        const lastWorkTimeMessage = await this.workTimeRepository.findOne({
          where: {
            user_id_fk: { user_id: workTime.user_id_fk.user_id },
            message_sent_at: LessThan(workTime.message_sent_at),
            message: 'start',
          },
          order: {
            message_sent_at: 'DESC',
          },
        });

        workTime.full_work_time =
          new Date(workTime.message_sent_at).getTime() -
          new Date(lastWorkTimeMessage.message_sent_at).getTime();
      }

      await this.workTimeRepository.save(workTime);

      const currentDate = new Date(
        new Date().setUTCHours(new Date().getUTCHours() + 2),
      );
      const firstFilteredDay = new Date(currentDate.setHours(0, 0, 0, 0));
      const lastHour = new Date(currentDate.setHours(23, 59, 59, 999));
      const workTimeList = await this.workTimeRepository.find({
        where: {
          user_id_fk: { user_id: workTime.user_id_fk.user_id },
          message_sent_at: Between(firstFilteredDay, lastHour),
        },
        order: {
          message_sent_at: 'ASC',
        },
      });

      return workTimeList;
    } catch (err) {
      throw err;
    }
  }

  async editWorkTime(workTime: WorkTime) {
    try {
      if (workTime.message == 'quit') {
        const lastWorkTimeMessage = await this.workTimeRepository.findOne({
          where: {
            user_id_fk: { user_id: workTime.user_id_fk.user_id },
            message_sent_at: LessThan(workTime.message_sent_at),
            message: 'start',
          },
          order: {
            message_sent_at: 'DESC',
          },
        });
        workTime.full_work_time =
          new Date(workTime.message_sent_at).getTime() -
          new Date(lastWorkTimeMessage.message_sent_at).getTime();
      }
      const x = await this.workTimeRepository.update(
        workTime.work_time_id,
        workTime,
      );

      const workTimeList = await this.workTimeRepository.find({
        where: { user_id_fk: { user_id: workTime.user_id_fk.user_id } },
      });

      return workTimeList;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async removeWorkTime(data) {
    try {
      const workTimeList = await this.workTimeRepository.find({
        where: { work_time_id: data.id },
      });

      if (!workTimeList?.length)
        throw { message: 'Nie znaleziono statusu', code: 404 };

      if (workTimeList.length > 1)
        throw {
          message: 'Znaleziono więcej niż jeden element o podanym ID',
          code: 404,
        };

      const [workTimeElementToDelete] = workTimeList;

      const date = new Date(
        new Date().setUTCHours(new Date().getUTCHours() + 2),
      );
      const currentDateWithoutTime = date.toISOString().slice(0, 10);

      const createdAtWithoutTimeString = workTimeElementToDelete.created_at
        .toISOString()
        .slice(0, 10);

      if (currentDateWithoutTime !== createdAtWithoutTimeString)
        throw {
          message: 'Nie można usuwać wiadomości z przeszłości',
          code: 404,
        };

      const deletedElement = await this.workTimeRepository.delete(data.id);

      if (deletedElement.affected !== 1)
        throw {
          message: 'Wystąpił błąd podczas usuwania',
          code: 500,
        };

      const updatedWorkTimeList = await this.workTimeRepository.find({
        where: { user_id_fk: { user_id: data.user_id_fk } },
      });

      return updatedWorkTimeList;
    } catch (err) {
      throw err;
    }
  }

  async updateWorkTime(id: number, workTime: WorkTime) {
    try {
      await this.workTimeRepository.update(id, workTime);
    } catch (err) {
      throw err;
    }
  }

  async deleteWorkTime(id: number) {
    try {
      await this.workTimeRepository.delete(id);
    } catch (err) {
      throw err;
    }
  }

  showUserWorkTimeForDate(
    id: number,
    startDate: Date,
    endDate: Date,
  ): Observable<WorkTime[]> {
    try {
      var ms = new Date(endDate).getTime() + 86400000;
      var tomorrow = new Date(ms);
      return from(
        this.workTimeRepository.find({
          where: {
            message_sent_at: Between(startDate, tomorrow),
            user_id_fk: { user_id: id },
          },
          order: { message_sent_at: 'ASC' },
          relations: ['user_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find times",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async filterWorkTime(id: number, startDate: Date, endDate: Date) {
    try {
      const correctedStartDate = new Date(
        new Date(startDate).setUTCHours(new Date(startDate).getUTCHours() + 2),
      );

      const correctedEndDate = new Date(
        new Date(endDate).setUTCHours(
          new Date(endDate).getUTCHours() + 25,
          59,
          59,
        ),
      );
      return await this.workTimeRepository.find({
        where: {
          message_sent_at: Between(correctedStartDate, correctedEndDate),
          user_id_fk: { user_id: id },
        },
        order: { message_sent_at: 'ASC' },
        relations: ['user_id_fk'],
      });
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: 'Wystąpił błąd podczas filtrowania',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async deleteAllForUser(id: number) {
    const entities = await this.workTimeRepository.find({
      where: {
        user_id_fk: { user_id: id },
      },
      relations: ['user_id_fk'],
    });
    if (!entities) {
      throw new NotFoundException('Entities not found, no changes applied!');
    }
    return this.workTimeRepository.remove(entities);
  }
}
