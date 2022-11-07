import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ArticleService } from "../../services/articles/article.service";
import { Article } from "../../../entities/Article";

@Controller('api/article')
@Crud({
  model:{
    type: Article
  },
  params:{
    id:{
      field:'articleId',
      type:'number',
      primary:true
    }
  },
  query:{
    join:{

    }
  }
})
export class ArticleController{
  constructor(public service:ArticleService) {

  }
}