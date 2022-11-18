import * as Validator from "class-validator";
import { ArticleFeatureComponentsDto } from "./article.feature.components.dto";
import { ValidateNested } from "class-validator";

export class AddArticleDto{

  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,125)
  name:string;
  categoryId:number;
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(12,255)
  excerpt:string;
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(54,10000)
  description:string;
  @Validator.IsNotEmpty()
  @Validator.IsNumber({
    allowInfinity:false,
    allowNaN:false,
    maxDecimalPlaces:2,
  })
  @Validator.IsPositive()
  price:number;
  @Validator.IsArray()
  @Validator.ValidateNested({
    always:true,
  })
  features:ArticleFeatureComponentsDto[]
}