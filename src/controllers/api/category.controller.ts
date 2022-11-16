import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "../../../entities/Category";
import { CategoryService } from "../../services/category/category.service";
import { RoleCheckedGuard } from "../../mlnsc/role.checker.guard";
import { AllowToRolesDescriptor } from "../../mlnsc/allow.to.roles.descriptor";

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
  },

  routes:{
    only:[
      "createOneBase",
      "createManyBase",
      "getManyBase",
      "getOneBase",
      "updateOneBase"
    ],
    createOneBase:{
      decorators:[
        UseGuards(RoleCheckedGuard),
        AllowToRolesDescriptor('administrator'),

      ],
    },
    createManyBase:{
      decorators:[
        UseGuards(RoleCheckedGuard),
        AllowToRolesDescriptor('administrator'),
      ],
    },
    updateOneBase:{
      decorators:[
        UseGuards(RoleCheckedGuard),
        AllowToRolesDescriptor('administrator'),
      ],

    },
    getManyBase:{
      decorators:[
        UseGuards(RoleCheckedGuard),
        AllowToRolesDescriptor('administrator','user'),
      ],
    },

    getOneBase:{
      decorators:[
        UseGuards(RoleCheckedGuard),
        AllowToRolesDescriptor('administrator','user'),
      ]
    }
  }
})
export class CategoryController{
    constructor(public service:CategoryService) {

    }
}