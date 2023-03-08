import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { AdminGuard } from 'src/guards/admin.guard';
import { Service } from '../models/service.interface';
import { ServiceService } from '../services/service.service';

@Controller('service')
export class ServiceController {
  constructor(private service: ServiceService) {}

  @Get()
  @UseGuards(AdminGuard)
  async getAllServices(@Res() res: Response) {
    try {
      const services = await this.service.getAllServices();
      res.json({ data: services });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Delete()
  @UseGuards(AdminGuard)
  async deleteService(@Body() data, @Res() res: Response) {
    try {
      const { id } = data;

      await this.service.deleteService(id);

      res.json({ message: 'Dyżur został usunięty', status: 'success' });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Patch()
  @UseGuards(AdminGuard)
  async updateService(@Body() service: Service, @Res() res: Response) {
    try {
      await this.service.updateService(service);

      res.json({ message: 'Dyżur został edytowany', status: 'success' });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }

  @Post()
  @UseGuards(AdminGuard)
  async createService(@Body() service: Service, @Res() res: Response) {
    try {
      await this.service.createService(service);
      res.json({ message: 'Dyżur został dodany', status: 'success' });
    } catch (err) {
      res
        .status(err?.code || 404)
        .json({ message: err?.message || 'Wystąpił błąd' });
    }
  }
}
