import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard } from 'src/guards/admin.guard';
import { UserGuard } from 'src/guards/user.guard';
import { TeamEntity } from 'src/teams/models/team.entity';
import { EditMessDto } from 'src/teams/DTO/EditMessDto';
import { UserDetail } from 'src/user/services/models/user_detail.interface';
import { UpdateResult } from 'typeorm';
import { TeamObjDto } from '../DTO/teamObjDto';
import { TeamsService } from '../services/teams.service';

@Controller('teams')
export class TeamController {
  constructor(private teamService: TeamsService) {}
  @Get('all')
  @UseGuards(UserGuard)
  returnList() {
    return this.teamService.findAll();
  }
  @Get(':team_name')
  @UseGuards(AdminGuard)
  findTeamByName(@Param() params: EditMessDto): Promise<TeamEntity[]> {
    console.log(params);

    return this.teamService.findOne(params.team_name);
  }

  @Post()
  @UseGuards(AdminGuard)
  createTeamInDateBase(@Body() team: TeamObjDto): Promise<HttpException> {
    return this.teamService.create(team);
  }
  @Put()
  @UseGuards(AdminGuard)
  updateUserInDateBase(@Body() change: EditMessDto): Promise<UpdateResult> {
    return this.teamService.update(change);
  }
  @Put('/delete')
  @UseGuards(AdminGuard)
  deleteTeamFromDataBase(@Body() message: EditMessDto): Promise<HttpException> {
    console.log(message);

    console.log('Deleting :' + message.team_name);
    return this.teamService.delete(message);
  }
  @Put('/edit')
  @UseGuards(AdminGuard)
  editTeam(@Body() teamObj: TeamObjDto): void {
    this.teamService.updateById(teamObj);
  }
}
