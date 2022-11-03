import { Body, Controller, Get, Param, Post, Put } from "@nestjs/common";
import { Administrator } from "../../../entities/administrator.entity";
import { AdministratorService } from "../../services/administrator/administrator.service";
import { AddAdministratorDto } from "../../dtos/administrator/addAdministratorDTO";
import { EditAdministratorDTO } from "../../dtos/administrator/edit.administrator.DTO";

// @ts-ignore
@Controller('api/administrator')
export class AdministratorController{

  constructor(
    private administratorService:AdministratorService
  ) {
  }

  @Get()
  getAllAdministrators(): Promise<Administrator[]> {
    return this.administratorService.getAll()
  }

  @Get(':id')
  getById(@Param('id') administratorId:number): Promise<Administrator> {
    return this.administratorService.getById(administratorId);
  }

  @Put()
    add( @Body()data:AddAdministratorDto): Promise<Administrator>{
      return this.administratorService.add(data);
    }

   @Post(':id')
  edit(@Param('id') id:number,@Body()data:EditAdministratorDTO): Promise<Administrator>{

    return this.administratorService.editById(id,data);
   }





}