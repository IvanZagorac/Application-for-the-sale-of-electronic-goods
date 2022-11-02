import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { database } from '../config/database';
import { Administrator } from '../entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';
import { ArticleFeature } from "../entities/ArticleFeature";
import { Article } from "../entities/Article";
import { ArticlePrice } from "../entities/ArticlePrice";
import { Cart } from "../entities/Cart";
import { CartArticle } from "../entities/CartArticle";
import { Category } from "../entities/Category";
import { Feature } from "../entities/Feature";
import { Order } from "../entities/Order";
import { Photo } from "../entities/Photo";
import { User } from "../entities/User";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: database.hostname,
      port: 3306,
      username: database.username,
      password: database.password,
      database: database.database,
      entities: [
        Administrator,
        ArticleFeature,
        Article,
        ArticlePrice,
        Cart,
        CartArticle,
        Category,
        Feature,
        Order,
        Photo,
        User
      ],
    }),
    TypeOrmModule.forFeature([Administrator]),
  ],
  controllers: [AppController],
  providers: [AdministratorService],
})
export class AppModule {}
