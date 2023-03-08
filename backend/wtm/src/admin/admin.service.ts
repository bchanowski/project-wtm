import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { from, map, Observable, switchMap } from 'rxjs';
import { AuthService } from 'src/auth/services/auth.service';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { AdminEntity } from './entities/admin.entity';
import { Admin } from './entities/admin.interface';
import { CreateAdminDto } from './entities/dto/CreateAdmin.dto';
import { LoginAdminDto } from './entities/dto/LoginAdmin.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(AdminEntity)
    private AdminRepository: Repository<AdminEntity>,
    private authService: AuthService,
  ) {}

  createAdmin(admin: CreateAdminDto): Observable<Admin> {
    return this.mailExists(admin.email).pipe(
      switchMap((exists: boolean) => {
        if (!exists) {
          return this.authService.hashPassword(admin.password).pipe(
            switchMap((passwordHash: string) => {
              admin.password = passwordHash;
              return from(this.AdminRepository.save(admin)).pipe(
                map((savedAdmin: Admin) => {
                  const { ...admin } = savedAdmin;
                  return admin;
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

  login(loginAdminDto: LoginAdminDto): Observable<string> {
    return this.findAdminByEmail(loginAdminDto.email.toLowerCase()).pipe(
      switchMap((admin: Admin) => {
        if (admin) {
          return this.validatePassword(
            loginAdminDto.password,
            admin.password,
          ).pipe(
            switchMap((passwordMatches: boolean) => {
              if (passwordMatches) {
                return this.findOne(admin.admin_id).pipe(
                  switchMap((admin: Admin) =>
                    this.authService.generateAdminJwt(admin),
                  ),
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
          throw new HttpException('Admin not found', HttpStatus.NOT_FOUND);
        }
      }),
    );
  }

  findAdminByEmail(email: string): Observable<Admin> {
    try {
      return from(
        this.AdminRepository.findOne({
          select: ['admin_id', 'email', 'password'],
          where: { email: email },
        }),
      );
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find admin",
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
    return from(this.AdminRepository.findOne({ where: { email: email } })).pipe(
      map((admin: Admin) => {
        return !!admin;
      }),
    );
  }

  findAll(): Observable<Admin[]> {
    try {
      return from(this.AdminRepository.find());
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find admins",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  findOne(id: number): Observable<Admin> {
    try {
      return from(this.AdminRepository.findOne({ where: { admin_id: id } }));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't find admins",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }

  updateAdmin(id: number, admin: Admin): Observable<UpdateResult> {
    try {
      if (admin.password) {
        this.authService.hashPassword(admin.password).subscribe((val) => {
          admin.password = val;
          return from(this.AdminRepository.update(id, admin));
        });
      }
      return from(this.AdminRepository.update(id, admin));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_MODIFIED,
          error_mess: "Couldn't update admin",
        },
        HttpStatus.NOT_MODIFIED,
      );
    }
  }

  remove(id: number): Observable<DeleteResult> {
    try {
      return from(this.AdminRepository.delete(id));
    } catch (err) {
      throw new HttpException(
        {
          status: HttpStatus.NOT_FOUND,
          error_mess: "Couldn't delete admin",
        },
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
