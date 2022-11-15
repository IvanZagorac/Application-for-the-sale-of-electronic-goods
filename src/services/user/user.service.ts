import {Injectable} from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { User } from "../../../entities/User";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserRegistrationDto } from "../../dtos/user/user.registration.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";
import * as crypto from "crypto";
import { Administrator } from "../../../entities/administrator.entity";

@Injectable()
export class UserService extends TypeOrmCrudService<User>{
  constructor(
    @InjectRepository(User)
    private readonly user:Repository<User>)//!!!! app module
  {
    super(user)
  }

    async register(data:UserRegistrationDto):Promise<User|ApiResponse>{
      const passwordHash=crypto.createHash('sha512');
      passwordHash.update(data.password);
      const passwordHashString=passwordHash.digest('hex').toUpperCase();

      const newUser:User=new User();
      newUser.email=data.email;
      newUser.passwordHash=passwordHashString;
      newUser.name=data.forename;
      newUser.surname=data.surname;
      newUser.phoneNumber=data.phone
      newUser.postalAdress=data.postalAdress;
      console.log(newUser)
      try{
        const savedUser=await this.user.save(newUser);
        if(!savedUser){
          throw new Error('');
        }

        return savedUser;
      }catch(e){
        return new ApiResponse('error',-6001,"User acc cant be created")
      }


    }

  async getById (id) {
    return await this.user.findOneBy(id);
  }

  async getByEmail(emailString:string): Promise<User | undefined>{
    const user=await this.user.findOne({where:{
      email:emailString
    }});
    if(user){
      return user;
    }else{
      return undefined;
    }

  }

}