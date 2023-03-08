import { Module } from '@nestjs/common';
import { ServiceService } from './services/service.service';
import { ServiceController } from './controllers/service.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServiceEntity } from './models/service.entity';
import { TeamEntity } from 'src/teams/models/team.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([ServiceEntity, TeamEntity]), JwtModule],
  providers: [ServiceService],
  controllers: [ServiceController],
})
export class ServiceModule {}
