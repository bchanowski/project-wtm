import { Module } from '@nestjs/common';
import { WorkTimeService } from './services/work-time.service';
import { WorkTimeController } from './controller/work-time.controller';
import { WorkTimeEntity } from './models/work-time.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([WorkTimeEntity]), JwtModule],
  providers: [WorkTimeService],
  controllers: [WorkTimeController],
})
export class WorkTimeModule {}
