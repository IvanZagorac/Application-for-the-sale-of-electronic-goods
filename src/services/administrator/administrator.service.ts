import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Administrator } from "../../../entities/administrator.entity";
import { Repository } from "typeorm";
import { AddAdministratorDto } from "../../dtos/administrator/addAdministratorDTO";
import { EditAdministratorDTO } from "../../dtos/administrator/edit.administrator.DTO";
import crypto from "crypto";



@Injectable()
export class AdministratorService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectRepository(Administrator)
    private readonly administrator: Repository<Administrator>,
  ) {}

  getAll():Promise<Administrator[]>{
    return this.administrator.find()
  }

  getById (administratorId: number): Promise<Administrator> {
    return this.administrator.findOne({where:{administratorId}});
  }

  add(data:AddAdministratorDto):Promise<Administrator>{
    const crypto=require('crypto');
    const passwordHash=crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString=passwordHash.digest('hex').toUpperCase();
    let newAdmin:Administrator=new Administrator();
    newAdmin.username=data.username;
    newAdmin.passwordHash=passwordHashString;

    return this.administrator.save(newAdmin)
  }

  async editById(administratorId:number,data:EditAdministratorDTO): Promise<Administrator>{
    let currAdmin:Administrator=await this.administrator.findOne({where:{administratorId}});

    const crypto=require('crypto');
    const passwordHash=crypto.createHash('sha512');
    passwordHash.update(data.password);

    const passwordHashString=passwordHash.digest('hex').toUpperCase();
    currAdmin.passwordHash=passwordHashString

    return this.administrator.save(currAdmin);
  }
}
