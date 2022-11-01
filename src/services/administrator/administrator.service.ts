import { Injectable } from '@nestjs/common';
import { InjectRepository } from "@nestjs/typeorm";
import { Administrator } from "../../../entities/administrator.entity";
import { Repository } from "typeorm";

@Injectable()
export class AdministratorService {
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor(
    @InjectRepository(Administrator)
    private readonly administrator: Repository<Administrator>,
  ) {}

  getAll():Promise<Administrator[]>{
    return this.administrator.find()
  }

  getById (id: number): Promise<Administrator> {
    // @ts-ignore
    return this.administrator.findOne(id);
  }
}
