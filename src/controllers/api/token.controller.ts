import { Body, Controller, HttpException, HttpStatus, Post, Req, UseGuards } from "@nestjs/common";
import { AdministratorService } from "../../services/administrator/administrator.service";
import { UserService } from "../../services/user/user.service";
import { RoleCheckedGuard } from "../../mlnsc/role.checker.guard";
import { AllowToRolesDescriptor } from "../../mlnsc/allow.to.roles.descriptor";
import { Request} from "express";
import { UserRefreshTokenDto } from "../../dtos/auth/user.refresh.token.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";
import { JwtDataDto } from "../../dtos/auth/jwt.data.dto";
import { jwtSecret } from "../../../config/jwt.secret";
import { JtwRefreshDto } from "../../dtos/auth/jtw.refresh.dto";
import* as jwt from'jsonwebtoken';
import { LoginInfoDto } from "../../dtos/auth/loginInfo.dto";

@Controller('token')
export class TokenController{
  constructor(
    private administratorService:AdministratorService,
    private userService:UserService
  ){}


     private getDatePlus(numberOfSeconds:number){
      return new Date().getTime() /1000+numberOfSeconds;

    }

    private getIsoDate(timestamp:number){
      const date=new Date();
      date.setTime(timestamp*1000);
      return date.toISOString()
    }

}

