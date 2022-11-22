import * as Validator from 'class-validator';
import { ArticleSearchFeatureComponents } from "./article.search.feature.components";
export class ArticleSearchDto{
  @Validator.IsOptional()
  @Validator.IsNotEmpty()
  @Validator.Length(2,128)
    keywords:string;

  @Validator.IsNotEmpty()
  @Validator.IsPositive()
  @Validator.IsNumber({
    allowInfinity:false,
    allowNaN:false,
    maxDecimalPlaces:0,
  })
    categoryId:number;

  @Validator.IsOptional()
  @Validator.IsNumber({
    allowInfinity:false,
    allowNaN:false,
    maxDecimalPlaces:2,
  })
    priceMin:number;

    @Validator.IsOptional()
    @Validator.IsNumber({
      allowInfinity:false,
      allowNaN:false,
      maxDecimalPlaces:2,
    })
    priceMax:number;
    features:ArticleSearchFeatureComponents[];

    @Validator.IsOptional()
    orderBy:"name"|"price";

    @Validator.IsOptional()
    orderDirection:"ASC"|"DESC";

  @Validator.IsPositive()
  @Validator.IsOptional()
  @Validator.IsNumber({
    allowInfinity:false,
    allowNaN:false,
    maxDecimalPlaces:2,
  })
    page:number;

  @Validator.IsPositive()
  @Validator.IsOptional()
    itemsPerPage:5|10|25|50|75;
}