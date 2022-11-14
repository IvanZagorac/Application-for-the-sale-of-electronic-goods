import {Injectable} from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Feature } from "../../../entities/Feature";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class FeatureService extends TypeOrmCrudService<Feature>{
  constructor(
    @InjectRepository(Feature)
    private readonly feature:Repository<Feature>)//!!!! app module
  {
    super(feature)
  }
}