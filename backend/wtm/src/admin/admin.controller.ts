import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { AdminGuard } from 'src/guards/admin.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AdminService } from './admin.service';
import { Admin } from './entities/admin.interface';
import { CreateAdminDto } from './entities/dto/CreateAdmin.dto';
import { LoginAdminDto } from './entities/dto/LoginAdmin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() admin: CreateAdminDto): Observable<Admin> {
    return this.adminService.createAdmin(admin);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() admin: LoginAdminDto): Observable<Record<string, unknown>> {
    return this.adminService.login(admin).pipe(
      map((jwt: string) => {
        return {
          email: admin.email,
          access_token: jwt,
          token_type: 'JWT',
          expires_in: '1 day',
        };
      }),
    );
  }

  @Post('mailExists')
  checkIfMailExists(@Body() admin: Admin): Observable<boolean> {
    return this.adminService.mailExists(admin.email);
  }

  @Get()
  @UseGuards(AdminGuard)
  findAll(): Observable<Admin[]> {
    return this.adminService.findAll();
  }

  @Get(':id')
  @UseGuards(AdminGuard)
  findOne(@Param('id') id: number): Observable<Admin> {
    return this.adminService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AdminGuard)
  update(
    @Param('id') id: number,
    @Body() admin: Admin,
  ): Observable<UpdateResult> {
    return this.adminService.updateAdmin(id, admin);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  remove(@Param('id') id: number): Observable<DeleteResult> {
    return this.adminService.remove(id);
  }
}
