import { Body, Controller, Post, Put, Req } from "@nestjs/common";
import { AdministratorService } from "../../services/administrator/administrator.service";
import { LoginAdministratorDto } from "../../dtos/administrator/login.administrator.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";
import * as crypto from "crypto";
import { LoginInfoDto } from "../../dtos/auth/loginInfo.dto";
import* as jwt from'jsonwebtoken';
import { JwtDataDto } from "../../dtos/auth/jwt.data.dto";
import{ Request } from "express"
import { jwtSecret } from "../../../config/jwt.secret";
import { UserRegistrationDto } from "../../dtos/user/user.registration.dto";
import { UserService } from "../../services/user/user.service";
import { LoginUserDto } from "../../dtos/user/login.user.dto";

@Controller('auth')
export class AuthController{
    constructor(
      public administratorService:AdministratorService,
      public userService:UserService
    ) {}

  @Post('administrator/login')
  async doAdministratorLogin(@Body()data:LoginAdministratorDto, @Req() req:Request): Promise<LoginInfoDto|ApiResponse>{
      const administrator=await this.administratorService.getByUsername(data.username);

      if(administrator==undefined){
         return new Promise(resolve=>{
           resolve(new ApiResponse("error",-3001));

         })
      }
      const crypto=require('crypto');
      const passwordHash=crypto.createHash('sha512');
      passwordHash.update(data.password);
      const passwordHashString=passwordHash.digest('hex').toUpperCase();

      if(administrator.passwordHash!==passwordHashString){
        return new Promise(resolve=>{
          resolve(new ApiResponse("error",-3002));

        })
      }

        const jwtData=new JwtDataDto();
        jwtData.role="administrator"
        jwtData.id=administrator.administratorId;
        jwtData.identity=administrator.username;
        let sada=new Date();
        sada.setDate(sada.getDate()+ 14);
        const istekTimestamp=sada.getTime() /1000;
        jwtData.ext=istekTimestamp;
        jwtData.ip=req.ip;
        jwtData.ua=req.headers["user-agent"];


      let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);
      const responseObject=new LoginInfoDto(
        administrator.administratorId,
        administrator.username,
        token
      );

      return new Promise(resolve=>resolve(responseObject));

  }


  @Post('user/login')
  async doUserLogin(@Body()data:LoginUserDto, @Req() req:Request): Promise<LoginInfoDto|ApiResponse>{
    const user=await this.userService.getByEmail(data.email);

    if(user==undefined){
      return new Promise(resolve=>{
        resolve(new ApiResponse("error",-3001));

      })
    }
    const crypto=require('crypto');
    const passwordHash=crypto.createHash('sha512');
    passwordHash.update(data.password);
    const passwordHashString=passwordHash.digest('hex').toUpperCase();

    if(user.passwordHash!==passwordHashString){
      return new Promise(resolve=>{
        resolve(new ApiResponse("error",-3002));

      })
    }

    const jwtData=new JwtDataDto();
    jwtData.role="user"
    jwtData.id=user.userId;
    jwtData.identity=user.email;

    let sada=new Date();
    sada.setDate(sada.getDate()+ 14);
    const istekTimestamp=sada.getTime() /1000;
    jwtData.ext=istekTimestamp;
    jwtData.ip=req.ip;
    jwtData.ua=req.headers["user-agent"];


    let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);
    const responseObject=new LoginInfoDto(
      user.userId,
      user.email,
      token
    );

    return new Promise(resolve=>resolve(responseObject));

  }

  @Put('user/register')
  async userRegister(@Body()data:UserRegistrationDto){
    return await this.userService.register(data);
  }

}