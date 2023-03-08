import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.headers.authorization) {
      return false;
    }
    request.user = await this.validate(request.headers.authorization);
    if (request.user.role == 'ADMIN') {
      return true;
    }
    return false;
  }
  async validate(auth: string) {
    return this.jwtService.decode(auth.split(' ')[1]);
  }
}
