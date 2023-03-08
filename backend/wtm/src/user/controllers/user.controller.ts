import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { map, Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
import { User } from '../services/models/user.interface';

import { UserService } from '../services/user.service';
import { CreateUserDto } from '../services/models/dto/CreateUser.dto';
import { LoginUserDto } from '../services/models/dto/LoginUser.dto';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';

@Controller('users')
export class UserController {
  constructor(private userService: UserService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(): Observable<User[]> {
    return this.userService.findAllUsers();
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() user: CreateUserDto): Observable<User> {
    return this.userService.createUser(user);
  }

  @Post('login')
  @HttpCode(200)
  login(
    @Body() loginUserDto: LoginUserDto,
  ): Observable<Record<string, unknown>> {
    return this.userService.login(loginUserDto).pipe(
      map((jwt: string) => {
        return {
          email: loginUserDto.email,
          access_token: jwt,
          token_type: 'JWT',
          expires_in: '1 day',
        };
      }),
    );
  }

  @Post('mailExists')
  checkIfMailExists(@Body() user: User): Observable<boolean> {
    return this.userService.mailExists(user.email);
  }

  @Put(':id')
  @UseGuards(UserGuard)
  update(
    @Param('id') id: number,
    @Body() user: User,
  ): Observable<UpdateResult> {
    return this.userService.updateUser(id, user);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') team_id: number): Observable<DeleteResult> {
    return this.userService.deleteUser(team_id);
  }

  // get request to user account view
  @Get('account/:email')
  @UseGuards(UserGuard)
  async getUserAccount(@Param('email') email: string, @Res() res: Response) {
    try {
      const account = await this.userService.getUserAccount(email);

      res.json({ data: account });
    } catch (err) {
      res
        .status(err.code || 404)
        .json({ message: err.message || 'Wystąpił błąd' });
    }
  }

  @Get('user/email/:email')
  @UseGuards(UserGuard)
  getUserByEmail(@Param('email') email: string): Observable<User> {
    return this.userService.findUserByEmail(email);
  }
}
