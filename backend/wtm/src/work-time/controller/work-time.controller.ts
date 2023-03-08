import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  Delete,
  Put,
  UseGuards,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

import { Response } from 'express';
import { Observable } from 'rxjs';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';
import { WorkTime } from '../models/work-time.interface';
import { WorkTimeService } from '../services/work-time.service';

@Controller('work-time')
export class WorkTimeController {
  constructor(private workTime: WorkTimeService) {}

  @Post('userAccount')
  @UseGuards(UserGuard)
  async createWorkTime(@Body() workTime: WorkTime, @Res() res: Response) {
    try {
      const workTimeList = await this.workTime.createWorkTime(workTime);

      res.json({
        message: 'Czas pracy został dodany',
        status: 'success',
        data: workTimeList,
      });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Patch('userAccount')
  @UseGuards(UserGuard)
  async editWorkTime(@Body() workTime: WorkTime, @Res() res: Response) {
    try {
      const workTimeList = await this.workTime.editWorkTime(workTime);

      res.json({
        message: 'Czas pracy został zmieniony',
        status: 'success',
        data: workTimeList,
      });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Delete('userAccount')
  @UseGuards(UserGuard)
  async removeWorkTime(@Body() data, @Res() res: Response) {
    try {
      const workTimeList = await this.workTime.removeWorkTime(data);

      res.json({
        message: 'Czas pracy został usunięty',
        status: 'success',
        data: workTimeList,
      });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Patch('update')
  @UseGuards(UserGuard)
  async updateWorkTime(@Body() workTime: WorkTime, @Res() res: Response) {
    try {
      await this.workTime.editWorkTime(workTime);

      res.json({ message: 'Czas pracy został edytowany', status: 'success' });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  async deleteWorkTime(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.workTime.deleteWorkTime(id);

      res.json({ message: 'Czas pracy został usunięty', status: 'success' });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Get('user/:id/:startDate/:endDate')
  @UseGuards(AdminGuard)
  findUserWorkTimeAtDate(
    @Param('id') id: number,
    @Param('startDate') startDate: Date,
    @Param('endDate') endDate: Date,
  ): Observable<WorkTime[]> {
    return this.workTime.showUserWorkTimeForDate(id, startDate, endDate);
  }

  @Post('/filterWorkTime')
  @UseGuards(UserGuard)
  async filterWorkTime(@Body() data, @Res() res: Response) {
    try {
      const { dateStart, dateEnd, id } = data;

      if (!dateStart || !dateStart || !id)
        throw {
          status: HttpStatus.NOT_FOUND,
          error_mess: 'Wystąpił błąd podczas filtrowania',
        };

      const workTimeMsgs = await this.workTime.filterWorkTime(
        id,
        dateStart,
        dateEnd,
      );

      if (!workTimeMsgs) {
        throw {
          status: HttpStatus.NOT_FOUND,
          error_mess: 'Wystąpił błąd podczas filtrowania',
        };
      }

      res.json({
        data: workTimeMsgs,
      });
    } catch (err) {
      throw new HttpException(
        {
          message: err?.response?.error_mess || 'Wystąpił błąd',
        },
        err?.status || HttpStatus.NOT_FOUND,
      );
    }
  }

  @Delete('user/:id')
  @UseGuards(UserGuard)
  async deleteAllForUser(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.workTime.deleteAllForUser(id);
      res.json({
        message: 'Usunięto wiadomości uzytkownika',
        status: 'success',
      });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }
}
