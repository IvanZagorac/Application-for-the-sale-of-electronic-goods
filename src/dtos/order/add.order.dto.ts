import * as Validator from "class-validator";

export class AddOrderDto{
  cartId:number;
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn(["rejected" , "accepted" , "send" , "pending"])
  status:"accepted"|"rejected"|"pending"|"send";
}