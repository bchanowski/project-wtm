import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { UserDetail } from '../services/models/user_detail.interface';
import { UserDetailService } from '../services/user_detail.service';

@Controller('userdetail')
export class UserDetailController {
  constructor(private userService: UserDetailService) {}

  @Get()
  @UseGuards(AdminGuard)
  findAll(): Observable<UserDetail[]> {
    return this.userService.findAllUsers();
  }

  @Get(':surname')
  @UseGuards(UserGuard)
  findUsersBySurname(
    @Param('surname') findSurname: string,
  ): Observable<UserDetail[]> {
    return this.userService.findUserBySurname(findSurname);
  }

  @Get('/one/:name')
  @UseGuards(UserGuard)
  findUserByName(@Param('name') name: string) {
    return this.userService.findUsersByName(name);
  }

  @Get('teamname/:surname/:teamname')
  @UseGuards(AdminGuard)
  findUsersByTeamAndName(
    @Param('teamname') teamname: string,
    @Param('surname') surname: string,
  ): Observable<UserDetail[]> {
    return this.userService.findUsersByTeamAndName(teamname, surname);
  }

  @Get('teamname/:teamname')
  @UseGuards(AdminGuard)
  findUsersByTeamName(
    @Param('teamname') teamname: string,
  ): Observable<UserDetail[]> {
    return this.userService.findUsersByTeamName(teamname);
  }

  @Get('team/:teamid')
  @UseGuards(AdminGuard)
  findUsersByTeamId(@Param('teamid') teamid: number): Observable<UserDetail[]> {
    return this.userService.findUsersByTeamId(teamid);
  }

  @Get('user/:id')
  @UseGuards(UserGuard)
  findUserById(@Param('id') id: number): Observable<UserDetail[]> {
    return this.userService.findUserById(id);
  }

  @Post()
  @UseGuards(AdminGuard)
  create(@Body() user: UserDetail): Observable<UserDetail> {
    return this.userService.createUserDetail(user);
  }

  @Put('edit/:id')
  @UseGuards(UserGuard)
  update(
    @Param('id') id: number,
    @Body() user: UserDetail,
  ): Observable<UpdateResult> {
    return this.userService.updateUserDetail(id, user);
  }

  @Delete(':id')
  @UseGuards(AdminGuard)
  delete(@Param('id') team_id: number): Observable<DeleteResult> {
    return this.userService.deleteUserDetail(team_id);
  }

  @Put('update')
  @UseGuards(UserGuard)
  updateUserTeam(@Body() message: string) {
    console.log('From Body');
    console.log(message);

    return this.userService.updateTeamByNameAndSurname(message);
  }
  @Put('delete')
  @UseGuards(AdminGuard)
  deleteTeam(@Body() message: string) {
    return this.userService.deleteTeamByNameAndSurname(message);
  }
}
