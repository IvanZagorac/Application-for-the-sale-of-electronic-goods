import { ArticleFeatureComponentsDto } from "./article.feature.components.dto";
import * as Validator from "class-validator";

export class EditArticleDto{
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
  status:'available'|'visible'|'hidden';
  @Validator.IsNotEmpty()
  @Validator.IsIn([0,1])
  isPromoted:0|1;
  price:number;
  @Validator.IsOptional()
  @Validator.IsArray()
  @Validator.ValidateNested({
    always:true,
  })
  features:ArticleFeatureComponentsDto[]|null
}