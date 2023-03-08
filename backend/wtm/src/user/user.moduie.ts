import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './services/user.service';
import { UserController } from './controllers/user.controller';
import { UserEntity } from './services/models/user.entity';
import { UserDetailEntity } from './services/models/user_detail.entity';
import { UserDetailService } from './services/user_detail.service';
import { UserDetailController } from './controllers/user_detail.controller';
import { AuthModule } from '../auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { HOEntity } from 'src/homeoffice-days/services/models/homeoffice.entity';
import { WorkTimeEntity } from 'src/work-time/models/work-time.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserEntity,
      UserDetailEntity,
      HOEntity,
      WorkTimeEntity,
    ]),
    AuthModule,
    JwtModule,
  ],
  providers: [UserService, UserDetailService],
  controllers: [UserController, UserDetailController],
})
export class UserModule {}
