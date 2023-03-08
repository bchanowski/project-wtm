import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = await this.validate(request.headers.authorization);
    if (request?.user?.role === 'USER' || request?.user?.role === 'ADMIN') {
      return true;
    }
    throw new HttpException(
      { status: HttpStatus.NOT_FOUND, message: 'Token nie jest prawidłowy' },
      HttpStatus.NOT_FOUND,
    );
  }
  async validate(auth: string) {
    return this.jwtService.decode(auth.split(' ')[1]);
  }
}
