import * as Validator from "class-validator";

export class UserRegistrationDto{
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
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,32)
    forename:string;
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(3,32)
    surname:string;
    @Validator.IsNotEmpty()
    @Validator.IsPhoneNumber()
    phone:string;
    @Validator.IsNotEmpty()
    @Validator.IsString()
    @Validator.Length(10,512)
    postalAdress:string;
}