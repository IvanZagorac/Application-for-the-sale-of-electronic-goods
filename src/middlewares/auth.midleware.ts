import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction,Request,Response } from "express";
import { AdministratorService } from "../services/administrator/administrator.service";
import* as jwt from'jsonwebtoken';
import { JwtDataDto } from "../dtos/auth/jwt.data.dto";
import { jwtSecret } from "../../config/jwt.secret";
import { UserService } from "../services/user/user.service";


@Injectable()
export class AuthMiddleware implements NestMiddleware{
  constructor(
    public  administratorService:AdministratorService,
    public userService:UserService,
    ) {
  }

  async use(req: Request, res: Response, next:NextFunction) {
    if (!req.headers.authorization) {
      throw new HttpException("No authorization token", HttpStatus.UNAUTHORIZED)
    }

    const token = req.headers.authorization;

    const tokenParts=token.split(' ');
    if(tokenParts.length!==2){
      throw  new HttpException("Wrong token length",HttpStatus.UNAUTHORIZED);
      console.log("Duljina nije 2")
    }

    const tokenString=tokenParts[1]

    let  jwtData: JwtDataDto;
    try{
      jwtData=jwt.verify(tokenString, jwtSecret);
    } catch(e){
      throw new HttpException("Wrong token", HttpStatus.UNAUTHORIZED);
      console.log("Glupi token")
    }
    if (!jwtData) {
      throw new HttpException("There is no available token", HttpStatus.UNAUTHORIZED);
      console.log("Ne postoji")
    }

    if (jwtData.ua !== req.headers["user-agent"]) {
      throw  new HttpException("Wrong user agent from token", HttpStatus.UNAUTHORIZED);
      console.log("ua")
    }

      if (jwtData.ip !== req.ip.toString()) {
        throw  new HttpException("Wrong ip from token", HttpStatus.UNAUTHORIZED);
      }

      if(jwtData.role==="administrator"){
        const administrator=await this.administratorService.getById(jwtData.id);
        if(!administrator){
          throw  new HttpException("Administrator not found found", HttpStatus.UNAUTHORIZED);
        }
      }else if(jwtData.role==="user"){
        const user=await this.userService.getById(jwtData.id);
        if(!user){
          throw  new HttpException("User not found found", HttpStatus.UNAUTHORIZED);
        }
      }

      const administrator=await this.administratorService.getById(jwtData.id);
      if(!administrator){
        throw  new HttpException("Administrator not found found", HttpStatus.UNAUTHORIZED);
      }


      const trenutniTimestammp=new Date().getTime()/1000;

      if(trenutniTimestammp>=jwtData.ext){
        throw  new HttpException("The token has expired", HttpStatus.UNAUTHORIZED);
      }

      req.token=jwtData

      next();
    }

  }