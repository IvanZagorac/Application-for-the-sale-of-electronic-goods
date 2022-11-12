import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Article } from "../../../entities/Article";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ArticlePrice } from "../../../entities/ArticlePrice";
import { ArticleFeature } from "../../../entities/ArticleFeature";
import { Photo } from "../../../entities/Photo";

@Injectable()
export class PhotoService extends TypeOrmCrudService<Photo> {
  constructor(
    @InjectRepository(Photo)
    private readonly photo: Repository<Photo>)//!!!! app module
  {
    super(photo)
  }

  add(newPhoto:Photo){
    return this.photo.save(newPhoto);

  }
}