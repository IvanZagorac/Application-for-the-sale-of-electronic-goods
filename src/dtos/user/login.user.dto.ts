import * as Validator from "class-validator";

export class LoginUserDto{
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain:false,
    allow_utf8_local_part:false
  })
  email:string;
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(6,128)
  password:string;
}