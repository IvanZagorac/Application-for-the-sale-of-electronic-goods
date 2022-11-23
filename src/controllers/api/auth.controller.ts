import { Body, Controller, HttpException, HttpStatus, Post, Put, Req, UseGuards } from "@nestjs/common";
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
import { JtwRefreshDto } from "../../dtos/auth/jtw.refresh.dto";
import { RoleCheckedGuard } from "../../mlnsc/role.checker.guard";
import { AllowToRolesDescriptor } from "../../mlnsc/allow.to.roles.descriptor";
import { UserRefreshTokenDto } from "../../dtos/auth/user.refresh.token.dto";

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
        jwtData.identity=administrator.username;let sada=new Date();
        sada.setDate(sada.getDate()+ 14);
        const istekTimestamp=sada.getTime() /1000;
        jwtData.ext=istekTimestamp;

        jwtData.ip=req.ip;
        jwtData.ua=req.headers["user-agent"];


      let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);

      const responseObject=new LoginInfoDto(
        administrator.administratorId,
        administrator.username,
        token,
        "",
        "",
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
    jwtData.ext=this.getDatePlus(60*5);
    jwtData.ip=req.ip;
    jwtData.ua=req.headers["user-agent"];

    let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);

    const jwtRefreshData=new JtwRefreshDto();
    jwtRefreshData.role=jwtData.role;
    jwtRefreshData.id=jwtData.id;
    jwtRefreshData.identity=jwtData.identity;
    jwtRefreshData.ext=this.getDatePlus(60*60*24*31)
    jwtRefreshData.ip=jwtData.ip;
    jwtRefreshData.ua=jwtData.ua;

    let refreshToken:string=jwt.sign(jwtRefreshData.toPlainObject(),jwtSecret)

    const responseObject=new LoginInfoDto(
      user.userId,
      user.email,
      token,
      refreshToken,
      this.getIsoDate(jwtRefreshData.ext)
    );

    await this.userService.addToken(
      user.userId,
      refreshToken,
      this.getDatabaseDateFormat(this.getIsoDate(jwtRefreshData.ext))
      );

    return new Promise(resolve=>resolve(responseObject));

  }

  @Put('user/register')
  async userRegister(@Body()data:UserRegistrationDto){
    return await this.userService.register(data);
  }


  @Post('user/refresh')
  async userTokenRefresh(@Req() req:Request,@Body() data:UserRefreshTokenDto):Promise<LoginInfoDto | ApiResponse> {

    const userToken=await this.userService.getUserToken(data.token);

    if(!userToken){
      return new ApiResponse("error",-10002,"No such refresh Token!");

    }

    if(userToken.isValid==0){
      return new ApiResponse("error",-10002,"Token is no valid");
    }

    const sada=new Date();
    const datumIsteka=new Date(userToken.expiresAt)

    if(datumIsteka.getTime()<sada.getTime()){
      return new ApiResponse("error",-10002,"Token has expired");
    }

    let  jwtRefreshData:JtwRefreshDto;
    try{
      jwtRefreshData=jwt.verify(data.token, jwtSecret);
    } catch(e) {
      throw new HttpException("Wrong token", HttpStatus.UNAUTHORIZED);
    }
    if (!jwtRefreshData) {
      throw new HttpException("There is no available token", HttpStatus.UNAUTHORIZED);
      console.log("Ne postoji")
    }

    if (jwtRefreshData.ua !== req.headers["user-agent"]) {
      throw  new HttpException("Wrong user agent from token", HttpStatus.UNAUTHORIZED);
      console.log("ua")
    }

    if (jwtRefreshData.ip !== req.ip.toString()) {
      throw  new HttpException("Wrong ip from token", HttpStatus.UNAUTHORIZED);
    }

    const jwtData=new JwtDataDto();
    jwtData.role=jwtRefreshData.role;
    jwtData.id=jwtRefreshData.id
    jwtData.identity=jwtRefreshData.identity
    jwtData.ext=this.getDatePlus(60*5);
    jwtData.ip=jwtRefreshData.ip;
    jwtData.ua=jwtRefreshData.ua

    let token:string=jwt.sign(jwtData.toPlainObject(),jwtSecret);

    const responseObject=new LoginInfoDto(
      jwtData.id,
      jwtData.identity,
      token,
      data.token,
      this.getIsoDate(jwtRefreshData.ext)
    );

    return responseObject

  }


  private getDatePlus(numberOfSeconds:number){
    return new Date().getTime() /1000+numberOfSeconds;

  }

  private getIsoDate(timestamp:number){
      const date=new Date();
      date.setTime(timestamp*1000);
      return date.toISOString()
  }

  private getDatabaseDateFormat(isoFormat:string):string{
      return isoFormat.substring(0,19).replace('T'," ");
  }

}