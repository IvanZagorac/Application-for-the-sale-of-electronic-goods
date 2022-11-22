import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { OrderService } from "../../services/order/order.service";
import { ApiResponse } from "../../mlnsc/api/response.class";
import { Order } from "../../../entities/Order";
import { RoleCheckedGuard } from "../../mlnsc/role.checker.guard";
import { AllowToRolesDescriptor } from "../../mlnsc/allow.to.roles.descriptor";
import { ChangeOrderStatusDto } from "../../dtos/order/change.order.status.dto";

@Controller('api/orderAdmin')
export class AdminOrderController{
  constructor(
    private orderService:OrderService,) {
  }

  @Get(':id')
  @UseGuards(RoleCheckedGuard)
  @AllowToRolesDescriptor('administrator')
  async get(@Param('id')id:number):Promise<Order | ApiResponse>{
    const order=await this.orderService.getById(id);

    if(!order){
      return new ApiResponse("error",-9001,"No such order found!");
    }

    return order
  }

  @Patch(':id')
  @UseGuards(RoleCheckedGuard)
  @AllowToRolesDescriptor('administrator')
  async changeStatus(@Param('id')id:number,@Body()data:ChangeOrderStatusDto){
    return await this.orderService.changeStatus(id,data.newStatus)

  }
}