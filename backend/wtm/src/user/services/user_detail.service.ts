import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { from, Observable } from 'rxjs';
import { UserDetailEntity } from './models/user_detail.entity';
import { UserDetail } from './models/user_detail.interface';

@Injectable()
export class UserDetailService {
  constructor(
    @InjectRepository(UserDetailEntity)
    private UserDetailRepository: Repository<UserDetailEntity>,
  ) {}

  createUserDetail(userDetail: UserDetail): Observable<UserDetail> {
    return from(this.UserDetailRepository.save(userDetail));
  }

  findAllUsers(): Observable<UserDetail[]> {
    try {
      return from(
        this.UserDetailRepository.find({
          relations: ['user_id', 'team_id_fk'],
          order: { user_detail_id: 'ASC' },
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findUserBySurname(findSurname: string): Observable<UserDetail[]> {
    try {
      return from(
        this.UserDetailRepository.find({
          where: {
            surname: Like(findSurname + '%'),
          },
          order: { user_detail_id: 'ASC' },
          relations: ['user_id', 'team_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find user",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  async updateTeamByNameAndSurname(message) {
    const user = await this.UserDetailRepository.find({
      where: { name: message.name, surname: message.surname },
      relations: ['user_id', 'team_id_fk'],
    });

    if (
      user.length == 1 &&
      (user[0].team_id_fk === null ||
        user[0].team_id_fk.team_id != message.team_id)
    ) {
      await this.UserDetailRepository.update(
        { name: message.name, surname: message.surname },
        { team_id_fk: message.team_id },
      );
      throw new HttpException(
        {
          status: HttpStatus.ACCEPTED,
          error_mess: 'Team zaktualizowany',
        },
        HttpStatus.ACCEPTED,
      );
    } else if (user.length == 0) {
      throw new HttpException(
        {
          status: HttpStatus.CONFLICT,
          error_mess: 'U??ytkownik nie istnieje !',
        },
        HttpStatus.CONFLICT,
      );
    } else if (
      message.team_id === user[0].team_id_fk.team_id &&
      user[0].name === message.name &&
      user[0].surname === message.surname
    ) {
      throw new HttpException(
        {
          status: HttpStatus.FOUND,
          error_mess: 'U??ytkownik jest juz w teamie!',
        },
        HttpStatus.FOUND,
      );
    }
  }
  async deleteTeamByNameAndSurname(message) {
    const user = await this.UserDetailRepository.find({
      where: { name: message.name, surname: message.surname },
      relations: ['user_id', 'team_id_fk'],
    });
    if (user.length === 1 && user[0].team_id_fk.team_id === message.team_id) {
      await this.UserDetailRepository.update(
        { name: message.name, surname: message.surname },
        { team_id_fk: null },
      );
      throw new HttpException(
        { status: HttpStatus.GONE, error_mess: 'Deleted' },
        HttpStatus.GONE,
      );
    } else if (user.length === 0) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: 'Nie mo??na usun???? nieistniej??cego u??ytkownika z teamu !',
        },
        HttpStatus.NOT_FOUND,
      );
    } else if (message.team_id !== user[0].team_id_fk.team_id) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error_mess: 'U??ytkownik nie nale??y do tego zespo??u !',
        },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  findUsersByTeamAndName(
    teamname: string,
    findSurname: string,
  ): Observable<UserDetail[]> {
    try {
      return from(
        this.UserDetailRepository.find({
          where: {
            surname: Like(findSurname + '%'),
            team_id_fk: { team_name: teamname },
          },
          relations: ['user_id', 'team_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find user",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findUsersByTeamName(teamname: string): Observable<UserDetail[]> {
    try {
      return from(
        this.UserDetailRepository.find({
          where: {
            team_id_fk: { team_name: teamname },
          },
          relations: ['user_id', 'team_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findUsersByTeamId(teamid: number): Observable<UserDetail[]> {
    try {
      return from(
        this.UserDetailRepository.find({
          where: {
            team_id_fk: { team_id: teamid },
          },
          relations: ['user_id', 'team_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find users",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findUserById(id: number): Observable<UserDetail[]> {
    try {
      return from(
        this.UserDetailRepository.find({
          where: {
            user_detail_id: id,
          },
          relations: ['user_id', 'team_id_fk'],
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find user",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  updateUserDetail(
    id: number,
    userDetail: UserDetail,
  ): Observable<UpdateResult> {
    try {
      return from(this.UserDetailRepository.update(id, userDetail));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_MODIFIED,
          error_mess: "Couldn't update user",
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  deleteUserDetail(id: number): Observable<DeleteResult> {
    try {
      return from(this.UserDetailRepository.delete(id));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.METHOD_NOT_ALLOWED,
          error_mess: "Couldn't delete user",
        },
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }
  }
  findUsersByName(name: string) {
    try {
      return from(this.UserDetailRepository.find({ where: { name: name } }));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find user",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
