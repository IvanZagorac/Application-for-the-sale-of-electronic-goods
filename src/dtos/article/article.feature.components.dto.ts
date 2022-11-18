import * as Validator from "class-validator";

export class ArticleFeatureComponentsDto {

  featureId:number;
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(1,255)
  value:string;
}