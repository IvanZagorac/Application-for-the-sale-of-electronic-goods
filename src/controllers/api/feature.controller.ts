import { Controller, UseGuards } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Feature } from "../../../entities/Feature";
import { CategoryService } from "../../services/category/category.service";
import { FeatureService } from "../../services/feature/feature.service";
import { RoleCheckedGuard } from "../../mlnsc/role.checker.guard";
import { AllowToRolesDescriptor } from "../../mlnsc/allow.to.roles.descriptor";

@Controller('api/feature')
@Crud({
  model:{
    type: Feature
  },
  params:{
    id:{
      field:'featureId',
      type:'number',
      primary:true
    }
  },
  query:{
    join:{
      articleFeatures:{
        eager:false
      },
      category:{
        eager:true
      },
      articles:{
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
export class FeatureController{
  constructor(public service:FeatureService) {

  }
}