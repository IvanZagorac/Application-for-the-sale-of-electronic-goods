import {Injectable} from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "../../../entities/Article";
import { AddArticleDto } from "../../dtos/article/add.article.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";
import { ArticlePrice } from "../../../entities/ArticlePrice";
import { ArticleFeature } from "../../../entities/ArticleFeature";

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>{
  constructor(
    @InjectRepository(Article)
    private readonly article:Repository<Article>,//!!!! app module

    @InjectRepository(ArticlePrice)
    private readonly articlePrice: Repository<ArticlePrice>,//!!!! app module

    @InjectRepository(ArticleFeature)
    private readonly articleFeature: Repository<ArticleFeature>//!!!! app module
      ){
        super(article)
      }

  async createFullArticle(data:AddArticleDto):Promise<Article | ApiResponse>{
    let newArticle:Article=new Article();
    newArticle.name=data.name;
    newArticle.categoryId=data.categoryId;
    newArticle.excerpt=data.excerpt;
    newArticle.description=data.description;

    let savedArticle=await this.article.save(newArticle);

    let newArticlePrice:ArticlePrice=new ArticlePrice();
    newArticlePrice.articleId=savedArticle.articleId;
    newArticlePrice.price=data.price;

    await this.articlePrice.save(newArticlePrice);

    for(let feature of data.features){
      let newArticleFeature=new ArticleFeature();
      newArticleFeature.articleId=savedArticle.articleId;
      newArticleFeature.featureId=feature.featureId;
      newArticleFeature.value=feature.value;

      await this.articleFeature.save(newArticleFeature);
    }

    return await this.article.findOne({where:{articleId: savedArticle.articleId},
      relations: {
        category: true,
        articleFeatures: true,
        features: true,
        articlePrices: true
      }}
    );

    }
}