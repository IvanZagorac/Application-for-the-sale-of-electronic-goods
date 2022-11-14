import { HttpException, HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction,Request,Response } from "express";
import { AdministratorService } from "../services/administrator/administrator.service";
import* as jwt from'jsonwebtoken';
import { JwtDataAdministratorDto } from "../dtos/administrator/jws.data.administrator.dto";
import { jwtSecret } from "../../config/jwt.secret";


@Injectable()
export class AuthMiddleware implements NestMiddleware{
  constructor(private  administratorService:AdministratorService) {
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

    let  jwtData: JwtDataAdministratorDto;
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

      const administrator=await this.administratorService.getById(jwtData.administratorId);
      if(!administrator){
        throw  new HttpException("Administrator not found found", HttpStatus.UNAUTHORIZED);
      }


      const trenutniTimestammp=new Date().getTime()/1000;

      if(trenutniTimestammp>=jwtData.ext){
        throw  new HttpException("The token has expired", HttpStatus.UNAUTHORIZED);
      }

      next();
    }

  }