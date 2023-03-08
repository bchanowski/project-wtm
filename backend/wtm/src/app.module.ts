import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { TeamsModule } from './teams/teams.module';
import { WorkTimeModule } from './work-time/work-time.module';
import { AdminModule } from './admin/admin.module';
import { HomeofficeModule } from './homeoffice-days/homeoffice.module';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.moduie';
import { ServiceModule } from './service/service.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      autoLoadEntities: true,
      synchronize: true,
    }),
    ServiceModule,
    TeamsModule,
    HomeofficeModule,
    WorkTimeModule,
    AdminModule,
    AuthModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
