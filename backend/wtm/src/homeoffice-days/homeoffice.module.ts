import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeofficerController } from './controllers/homeoffice.controller';
import { HomeofficeService } from './services/homeoffice.service';
import { HOEntity } from './services/models/homeoffice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([HOEntity]), JwtModule],
  providers: [HomeofficeService],
  controllers: [HomeofficerController],
})
export class HomeofficeModule {}
