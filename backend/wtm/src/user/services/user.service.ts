import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, DeleteResult, Repository, UpdateResult } from 'typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { UserEntity } from './models/user.entity';
import { User } from './models/user.interface';
import { UserDetailEntity } from './models/user_detail.entity';
import { AuthService } from '../../auth/services/auth.service';
import { CreateUserDto } from './models/dto/CreateUser.dto';
import { LoginUserDto } from './models/dto/LoginUser.dto';
import { WorkTimeEntity } from 'src/work-time/models/work-time.entity';
import { HOEntity } from 'src/homeoffice-days/services/models/homeoffice.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private UserRepository: Repository<UserEntity>,
    private authService: AuthService,

    @InjectRepository(UserDetailEntity)
    private UserDetailRepository: Repository<UserDetailEntity>,

    @InjectRepository(WorkTimeEntity)
    private WorkTimeRepository: Repository<WorkTimeEntity>,

    @InjectRepository(HOEntity)
    private HomeOfficeRepository: Repository<HOEntity>,
  ) {}

  createUser(user: CreateUserDto): Observable<User> {
    return this.mailExists(user.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
              user.password = passwordHash;
              return from(this.UserRepository.save(user)).pipe(
                map((savedUser: User) => {
                  const { ...user } = savedUser;
                  return user;
                }),
              );
            }),
          );
        } else {
          throw new HttpException('Email already in use', HttpStatus.CONFLICT);
        }
      }),
    );
  }

  login(loginUserDto: LoginUserDto): Observable<string> {
    return this.findUserByEmail(loginUserDto.email.toLowerCase()).pipe(
      switchMap((user: User) => {
        if (user) {
          return this.validatePassword(
            loginUserDto.password,
            user.password,
          ).pipe(
            switchMap((passwordMatches: boolean) => {
              if (passwordMatches) {
                return this.findOne(user.user_id).pipe(
                  switchMap((user: User) => this.authService.generateJwt(user)),
                );
              } else {
                throw new HttpException(
                  'Login was unsuccessful',
                  HttpStatus.UNAUTHORIZED,
                );
              }
            }),
          );
        } else {
          throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  findAllUsers(): Observable<User[]> {
    try {
      return from(this.UserRepository.find());
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

  updateUser(id: number, User: User): Observable<UpdateResult> {
    try {
      if (User.password) {
        this.authService.hashPassword(User.password).subscribe((val) => {
          User.password = val;
          return from(this.UserRepository.update(id, User));
        });
      }
      return from(this.UserRepository.update(id, User));
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

  deleteUser(id: number): Observable<DeleteResult> {
    try {
      return from(this.UserRepository.delete(id));
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

  async getUserAccount(email: string) {
    const currentDate = new Date(
      new Date().setUTCHours(new Date().getUTCHours() + 2),
    );
    const firstFilteredDay = new Date(currentDate.setHours(0, 0, 0, 0));
    const lastHour = new Date(currentDate.setHours(23, 59, 59, 999));
    const numberOfDays = 5;
    const firstFilteredDayString = firstFilteredDay.toISOString().slice(0, 10);
    const lastFilteredDayString = new Date(
      currentDate.setDate(new Date().getDate() + numberOfDays),
    )
      .toISOString()
      .slice(0, 10);

    try {
      const accounts = await this.UserRepository.find({
        where: {
          email: email,
        },
      });
      const userId = accounts[0]?.user_id;

      if (!userId) {
        throw { message: 'Użytkownik o podanym ID nie istnieje', code: 404 };
      }

      const workTimeList = await this.WorkTimeRepository.find({
        where: {
          user_id_fk: { user_id: userId },
          message_sent_at: Between(firstFilteredDay, lastHour),
        },
        order: {
          message_sent_at: 'ASC',
        },
      });

      const homeOfficeList = await this.HomeOfficeRepository.find({
        where: {
          user_id_fk: { user_id: userId },
          date: Between(firstFilteredDayString, lastFilteredDayString),
        },
        order: {
          message_sent_at: 'ASC',
        },
      });

      const userDetails = await this.UserDetailRepository.find({
        where: { user_detail_id: userId },
        relations: ['team_id'],
      });
      if (!accounts?.length || !userDetails?.length)
        throw { message: 'Użytkownik o podanym ID nie istnieje', code: 404 };

      const [account] = accounts;
      const [userDetail] = userDetails;

      return {
        ...account,
        ...userDetail,
        workTimeMessages: workTimeList,
        homeofficeDays: homeOfficeList,
      };
    } catch (err) {
      throw err;
    }
  }

  findOne(id: number): Observable<User> {
    try {
      return from(this.UserRepository.findOne({ where: { user_id: id } }));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: 'Nie znaleziono użytkownika',
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findUserByEmail(email: string): Observable<User> {
    try {
      return from(
        this.UserRepository.findOne({
          select: ['user_id', 'email', 'password'],
          where: { email: email },
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

  private validatePassword(
    password: string,
    storedPasswordHash: string,
  ): Observable<boolean> {
    return this.authService.comparePasswords(password, storedPasswordHash);
  }

  mailExists(email: string): Observable<boolean> {
    return from(this.UserRepository.findOne({ where: { email: email } })).pipe(
      map((user: User) => {
        return !!user;
      }),
    );
  }
}
