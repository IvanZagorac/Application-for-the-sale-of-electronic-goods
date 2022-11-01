import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { database } from '../config/database';
import { Administrator } from '../entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: database.hostname,
      port: 3306,
      username: database.username,
      password: database.password,
      database: database.database,
      entities: [Administrator],
    }),
    TypeOrmModule.forFeature([Administrator]),
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
