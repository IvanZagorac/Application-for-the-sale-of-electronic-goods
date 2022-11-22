import * as Validator from "class-validator";

export class ChangeOrderStatusDto{
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.IsIn(["rejected" , "accepted" , "send" , "pending"])
  newStatus:"accepted"|"rejected"|"pending"|"send";
}