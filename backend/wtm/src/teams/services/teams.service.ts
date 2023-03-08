import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { EditMessDto } from 'src/teams/DTO/EditMessDto';

import { Like, Repository } from 'typeorm';
import { TeamEntity } from '../models/team.entity';
import { TeamObjDto } from '../DTO/teamObjDto';

@Injectable()
export class TeamsService {
  constructor(
    @InjectRepository(TeamEntity)
    private teamRepository: Repository<TeamEntity>,
  ) {}

  findAll(): Promise<TeamEntity[]> {
    return this.teamRepository.find();
  }
  async findOne(team_name_inp: string) {
    if (
      (await this.teamRepository.find({ where: { team_name: team_name_inp } }))
        .length > 0
    ) {
      return await this.teamRepository.find({
        where: { team_name: Like(`%${team_name_inp}%`) },
      });
    } else {
      throw new HttpException(
        { status: HttpStatus.NOT_FOUND, error_mess: 'Team does not exist' },
        HttpStatus.NOT_FOUND,
      );
    }
  }
  async create(team: TeamObjDto) {
    team.team_name = team.team_name.toLocaleLowerCase();
    try {
      const isInDb = await this.teamRepository.find({
        where: { team_name: team.team_name },
      });
      console.log(isInDb);

      if (isInDb.length === 0) {
        this.teamRepository.save(team);
        return new HttpException(
          { status: HttpStatus.CREATED, error_mess: 'Utworzony' },
          HttpStatus.CREATED,
        );
      } else {
        return new HttpException(
          {
            status: HttpStatus.CONFLICT,
            error_mess: 'Nie można dodać',
          },
          HttpStatus.CONFLICT,
        );
      }
    } catch (error) {
      console.log(error.messege);
    }
  }
  async update(mess: EditMessDto) {
    mess.team_name = mess.team_name.toLocaleLowerCase();
    mess.changed_team_name = mess.changed_team_name.toLocaleLowerCase();

    return this.teamRepository.update(
      { team_name: mess.team_name }, //name that was looking for
      { team_name: mess.changed_team_name }, //name to be upadted
    );
  }
  async delete(message: EditMessDto) {
    console.log(`deleting ${message.team_name}`);
    const response = await this.teamRepository.find({
      where: { team_name: `${message.team_name}` },
    });

    console.log(response);

    if (response.length === 0) {
      return new HttpException(
        { status: HttpStatus.NOT_ACCEPTABLE, error_mess: 'Nie można usunąć' },
        HttpStatus.NOT_ACCEPTABLE,
      );
    } else {
      await this.teamRepository.delete({
        team_name: `${message.team_name}`,
      });
      return new HttpException(
        { status: HttpStatus.OK, error_mess: 'Usunięto' },
        HttpStatus.OK,
      );
    }
  }
  updateById(teamObj: TeamObjDto) {
    try {
      return this.teamRepository.update(
        { team_id: teamObj.team_id },
        {
          team_name: teamObj.team_name,
          created_at: teamObj.created_at,
          edited_at: teamObj.edited_at,
        },
      );
    } catch (error) {
      throw new HttpException(
        { status: HttpStatus.NOT_MODIFIED, error_mess: 'Not updated' },
        HttpStatus.NOT_MODIFIED,
      );
    }
  }
}
