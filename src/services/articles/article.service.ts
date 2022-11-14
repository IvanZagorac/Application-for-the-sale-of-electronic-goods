import {Injectable} from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Article } from "../../../entities/Article";
import { AddArticleDto } from "../../dtos/article/add.article.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";
import { ArticlePrice } from "../../../entities/ArticlePrice";
import { ArticleFeature } from "../../../entities/ArticleFeature";
import { EditArticleDto } from "../../dtos/article/edit.article.dto";

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

    async editFullArticle(articleId:number,data:EditArticleDto):Promise<Article|ApiResponse>{
    const existingArticle:Article=await this.article.findOne({where:{articleId},
        relations: ['articlePrices','articleFeatures']
      });

    if(!existingArticle){
      return new ApiResponse("error",-5001,"Article not found");

    }
    existingArticle.name=data.name;
    existingArticle.categoryId=data.categoryId;
    existingArticle.excerpt=data.excerpt;
    existingArticle.description=data.description;
    existingArticle.status=data.status;
    existingArticle.isPromoted=data.isPromoted;

    const savedArticle=await this.article.save(existingArticle);

    if(!savedArticle){
      return new ApiResponse('error',-5002,"Could not save new article data-");

    }

    const newPriceString:string=Number(data.price).toFixed(2)
    const lastPrice=existingArticle.articlePrices[existingArticle.articlePrices.length-1]
    const lastPriceString:string=Number(lastPrice).toFixed(2)
      if(newPriceString!==lastPriceString){
        const newArticlePrice=new ArticlePrice()
        newArticlePrice.articleId=articleId;
        newArticlePrice.price=data.price;
        const savedArticlePrice=await this.articlePrice.save(newArticlePrice);
        if(!savedArticlePrice){
          new ApiResponse("error",-5003,"Would not save new article price");
        }
      }

      if(data.features!==null){
        await this.articleFeature.remove(existingArticle.articleFeatures)
        for(let feature of data.features){
          let newArticleFeature=new ArticleFeature();
          newArticleFeature.articleId=articleId;
          newArticleFeature.featureId=feature.featureId;
          newArticleFeature.value=feature.value;

          await this.articleFeature.save(newArticleFeature);
        }
      }

      return await this.article.findOne({where:{articleId: articleId},
        relations: [
          "category",
          "articleFeatures",
          "features",
          "articlePrices"
        ]}
      );
  }
}