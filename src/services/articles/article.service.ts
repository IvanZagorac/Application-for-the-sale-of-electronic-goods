import {Injectable} from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Any, In, Repository } from "typeorm";
import { Article } from "../../../entities/Article";
import { AddArticleDto } from "../../dtos/article/add.article.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";
import { ArticlePrice } from "../../../entities/ArticlePrice";
import { ArticleFeature } from "../../../entities/ArticleFeature";
import { EditArticleDto } from "../../dtos/article/edit.article.dto";
import { ArticleSearchDto } from "../../dtos/article/article.search.dto";

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
          "articlePrices",
          "photos"
        ]}
      );
  }

  async search(data:ArticleSearchDto):Promise<Article[]>{
      const builder=await this.article.createQueryBuilder("article");

      builder.innerJoinAndSelect("article.articlePrices"
        ,"ap",
        "ap.createdAt=(SELECT ap.created_at FROM article_price as ap WHERE ap.article_id=article.article_id ORDER BY ap.createdAt DESC LIMIT1)")
      builder.leftJoinAndSelect("article.articleFeatures","af")

      builder.where('article.categoryId= :id',{id:data.categoryId})

      if(data.keywords && data.keywords.length>0){
        builder.andWhere(
          `(article.name LIKE:kw OR
           article.excerpt LIKE:kw OR
           article.description LIKE:kw)
              `,{kw: '%'+ data.keywords.trim() + '%'});
      }

      if(data.priceMin && typeof data.priceMin==='number'){
        builder.andWhere('ap.price>= :min',{min: data.priceMin})
      }

      if(data.priceMax && typeof data.priceMax==='number'){
        builder.andWhere('ap.price<= :max',{max: data.priceMax})
      }

      if(data.features&& data.features.length>0){
        for(let feature of data.features){
          builder.andWhere('af.featureId=:fId AND af.value IN (:fVals)',
            {
              fId:feature.featureId,
              fVals:feature.values,
            })
        }
      }

      let orderBy='article.name';
      let orderDirection :'ASC'|'DESC'='ASC';

      if(data.orderBy){
        orderBy=data.orderBy

        if(orderBy==='price'){
          orderBy='ap.price';//!Pot greska
        }
        if(orderBy==='name'){
          orderBy='article.name';//!Pot greska
        }
      }
      if(data.orderDirection){
        orderDirection=data.orderDirection
      }

      builder.orderBy(orderBy,orderDirection)

      let page=0;
      let perPage:5|10|25|50|75=25;

      if(data.page && typeof data.page==='number'){
        page=data.page;
      }

      if(data.itemsPerPage &&typeof data.itemsPerPage==='number'){
        perPage=data.itemsPerPage;
      }

      builder.skip(page*perPage);
      builder.take(perPage);

      let articleIds= await (await builder.getMany()).map(article=>article.articleId);

      return await this.article.find({
        where:{articleId: In(articleIds)},
        relations: [
          "category",
          "articleFeatures",
          "features",
          "articlePrices",
          "photos"
        ]
      })
  }
}