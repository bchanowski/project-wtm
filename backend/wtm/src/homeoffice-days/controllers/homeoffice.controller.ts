import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Res,
  Put,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';

import { Observable } from 'rxjs';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { HomeofficeService } from '../services/homeoffice.service';
import { Homeoffice_days } from '../services/models/homeoffice.interface';

@Controller('homeoffice')
export class HomeofficerController {
  constructor(private homeofficeService: HomeofficeService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(): Observable<Homeoffice_days[]> {
    return this.homeofficeService.findAllDays();
  }

  @Get('user/:id')
  @UseGuards(UserGuard)
  findAllUserDays(@Param('id') checkId: number): Observable<Homeoffice_days[]> {
    return this.homeofficeService.findAllUserDays(checkId);
  }

  @Post()
  @UseGuards(AdminGuard)
  newDay(@Body() ho: Homeoffice_days): Observable<Homeoffice_days> {
    return this.homeofficeService.newHomeofficeDay(ho);
  }

  // Patryk
  @Post('userAccount')
  @UseGuards(UserGuard)
  async addRemoteDay(
    @Body() homeOffice: Homeoffice_days,
    @Res() res: Response,
  ) {
    try {
      const remoteDays = await this.homeofficeService.addNewRemoteDay(
        homeOffice,
      );

      res.json({
        message: 'Dzień zdalny został dodany',
        status: 'success',
        data: remoteDays,
      });
    } catch (err) {
      res.status(err?.code || 404).json({
        message: err.message || 'Wystąpił błąd podczas dodawania dnia zdalnego',
      });
    }
  }

  @Delete('userAccount')
  @UseGuards(UserGuard)
  async removeRemoteDay(@Body() data, @Res() res: Response) {
    try {
      const remoteDays = await this.homeofficeService.removeRemoteDay(data);

      res.json({
        message: 'Dzień zdalny został usunięty',
        status: 'success',
        data: remoteDays,
      });
    } catch (err) {
      res.status(err?.code || 404).json({
        message: err.message || 'Wystąpił błąd podczas usuwania dnia zdalnego',
      });

      // throw new HttpException(
      //   {
      //     status: HttpStatus.NOT_FOUND,
      //     error_mess: "Couldn't find users days",
      //   },
      //   HttpStatus.NOT_FOUND,
      // );
    }
  }

  // Patryk
  @Patch('userAccount')
  @UseGuards(UserGuard)
  async updateRemoteDay(
    @Body() homeOffice: Homeoffice_days,
    @Res() res: Response,
  ) {
    try {
      const remoteDays = await this.homeofficeService.updateRemoteDay(
        homeOffice,
      );

      res.json({
        message: 'Dzień zdalny został zmieniony',
        status: 'success',
        data: remoteDays,
      });
    } catch (err) {
      res.status(err?.code || 404).json({
        message: err.message || 'Wystąpił błąd podczas dodawania dnia zdalnego',
      });
    }
  }

  @Get('user/:id/:checkDate')
  @UseGuards(UserGuard)
  findUserDates(
    @Param('id') id: number,
    @Param('checkDate') checkDate: string,
  ): Observable<Homeoffice_days[]> {
    return this.homeofficeService.findUserAndDay(id, checkDate);
  }

  @Get('/date/:checkDate')
  @UseGuards(AdminGuard)
  findAllUsersDay(
    @Param('checkDate') checkDate: string,
  ): Observable<Homeoffice_days[]> {
    return this.homeofficeService.findAllUsersOnDay(checkDate);
  }

  @Get('/between/:id/:dateStart/:dateEnd')
  @UseGuards(AdminGuard)
  findUserDayBetween(
    @Param('id') id: number,
    @Param('dateStart') dateStart: string,
    @Param('dateEnd') dateEnd: string,
  ) {
    return this.homeofficeService.findUserDateBetween(id, dateStart, dateEnd);
  }

  // Patryk
  @Post('/filterRemoteDays')
  @UseGuards(UserGuard)
  async filterRemoteDays(@Body() data, @Res() res: Response) {
    try {
      const { dateStart, dateEnd, id } = data;

      const remoteDays = await this.homeofficeService.filterRemoteDays(
        id,
        dateStart,
        dateEnd,
      );
      res.json({
        data: remoteDays,
      });
    } catch (err) {
      res.status(err?.code || 404).json({
        message: err.message || 'Wystąpił błąd podczas pobierania wyników',
      });
    }
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  updateHomeofficeDay(
    @Param('id') id: number,
    @Body() ho: Homeoffice_days,
  ): Observable<UpdateResult> {
    return this.homeofficeService.updateHomeoffice(id, ho);
  }

  @Delete(':id')
  @UseGuards(UserGuard)
  deleteDate(@Param('id') id: number): Observable<DeleteResult> {
    return this.homeofficeService.deleteDay(id);
  }

  @Delete('user/:id')
  @UseGuards(UserGuard)
  async deleteAllForUser(@Param('id') id: number, @Res() res: Response) {
    try {
      await this.homeofficeService.deleteAllForUser(id);
      res.json({
        message: 'Usunięto dni zdalne uzytkownika',
        status: 'success',
      });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }
}
