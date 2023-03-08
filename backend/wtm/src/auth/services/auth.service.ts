import { Injectable } from '@nestjs/common';
import { from, Observable } from 'rxjs';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/services/models/user.interface';
import { Admin } from 'src/admin/entities/admin.interface';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  generateJwt(user: User): Observable<string> {
    return from(this.jwtService.signAsync({ user: user, role: 'USER' }));
  }

  generateAdminJwt(admin: Admin): Observable<string> {
    return from(this.jwtService.signAsync({ admin: admin, role: 'ADMIN' }));
  }

  hashPassword(password: string): Observable<string> {
    return from<string>(bcrypt.hash(password, 12));
  }

  comparePasswords(
    password: string,
    storedPasswordHash: string,
  ): Observable<any> {
    return from(bcrypt.compare(password, storedPasswordHash));
  }
}
