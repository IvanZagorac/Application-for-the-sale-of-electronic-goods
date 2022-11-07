import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "../../../entities/Category";
import { CategoryService } from "../../services/category/category.service";

@Controller('api/category')
@Crud({
  model:{
    type: Category
  },
  params:{
    id:{
      field:'categoryId',
      type:'number',
      primary:true
    }
  },
  query:{
    join:{
      categories:{
        eager:true
      },
      features:{
        eager:true
      },
      articles:{
        eager:false
      },
      parentCategory:{
        eager:false
      }
    }
  }
})
export class CategoryController{
    constructor(public service:CategoryService) {

    }
}