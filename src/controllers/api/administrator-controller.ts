import { Body, Controller, Get, Param, Patch, Post, Put, UseGuards } from "@nestjs/common";
import { Administrator } from "../../../entities/administrator.entity";
import { AdministratorService } from "../../services/administrator/administrator.service";
import { AddAdministratorDto } from "../../dtos/administrator/addAdministratorDTO";
import { EditAdministratorDTO } from "../../dtos/administrator/edit.administrator.DTO";
import { ApiResponse } from "../../mlnsc/api/response.class";
import { AllowToRolesDescriptor } from "../../mlnsc/allow.to.roles.descriptor";
import { RoleCheckedGuard } from "../../mlnsc/role.checker.guard";

// @ts-ignore
@Controller('api/administrator')
export class AdministratorController{

  constructor(
    private administratorService:AdministratorService
  ) {
  }


  @Get()
  @UseGuards(RoleCheckedGuard)
  @AllowToRolesDescriptor('administrator')
  getAllAdministrators(): Promise<Administrator[]> {
    return this.administratorService.getAll()
  }

  @Get(':id')
  @UseGuards(RoleCheckedGuard)
  @AllowToRolesDescriptor('administrator')
  getById(@Param('id') administratorId:number): Promise<Administrator> {
    return this.administratorService.getById(administratorId);
  }

  @Post()
  @UseGuards(RoleCheckedGuard)
  @AllowToRolesDescriptor('administrator')
    add( @Body()data:AddAdministratorDto): Promise<Administrator |ApiResponse>{
      return this.administratorService.add(data);
    }

   @Patch(':id')
   @UseGuards(RoleCheckedGuard)
   @AllowToRolesDescriptor('administrator')
   edit(@Param('id') id:number,@Body()data:EditAdministratorDTO): Promise<Administrator | ApiResponse>{

    return this.administratorService.editById(id,data);
   }





}