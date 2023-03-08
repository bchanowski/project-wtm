import { Module } from '@nestjs/common';
import { TeamsService } from './services/teams.service';
import { TeamController } from './controllers/teams.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TeamEntity } from './models/team.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([TeamEntity]), JwtModule],
  controllers: [TeamController],
  providers: [TeamsService],
})
export class TeamsModule {}
