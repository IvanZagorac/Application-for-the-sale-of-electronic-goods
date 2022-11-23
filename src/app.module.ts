import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { AppController } from './controllers/app.controller';
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
import { AdministratorController } from "./controllers/api/administrator-controller";
import { CategoryController } from "./controllers/api/category.controller";
import { CategoryService } from "./services/category/category.service";
import { ArticleService } from "./services/articles/article.service";
import { ArticleController } from "./controllers/api/article.controller";
import { AuthController } from "./controllers/api/auth.controller";
import { AuthMiddleware } from "./middlewares/auth.midleware";
import { PhotoService } from "./services/photo/photo.service";
import { FeatureService } from "./services/feature/feature.service";
import { FeatureController } from "./controllers/api/feature.controller";
import { UserService } from "./services/user/user.service";
import { CartService } from "./services/cart/cart.service";
import { UserCartController } from "./controllers/api/user.cart.controller";
import { OrderService } from "./services/order/order.service";
import { OrderMailerService } from "./services/order/order.mailer.service";
import { MailerModule } from "@nestjs-modules/mailer";
import { MailConfig } from "../config/mail.config";
import { AdminOrderController } from "./controllers/api/admin.order.controller";
import { UserToken } from "../entities/User.token";

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
        User,
        UserToken
      ],
    }),
    TypeOrmModule.forFeature([
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
      User,
      UserToken,

    ]),
    MailerModule.forRoot({
      transport: {
        host: MailConfig.hostname,
        port: 587,
        secure: false,
        auth: {
          user: MailConfig.username,
          pass: MailConfig.password,
        },
        tls:{
          rejectUnauthorized:false
        }
      },
      defaults: {
        from: MailConfig.senderEmail,
      },
    })
  ],
  controllers: [
    AppController,
    AdministratorController,
    CategoryController,
    ArticleController,
    AuthController,
    FeatureController,
    UserCartController,
    AdminOrderController
  ],
  providers: [
    AdministratorService,
    CategoryService,
    ArticleService,
    PhotoService,
    FeatureService,
    UserService,
    CartService,
    UserService,
    OrderService,
    OrderMailerService
  ],
  exports:[
    AdministratorService,
    UserService
  ],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware)
      .exclude('auth/*')
      .forRoutes("api/*")
  }
}
