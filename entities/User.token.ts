import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";
import *  as Validator from 'class-validator'


@Entity("user_token", { schema: "web_app" })
export class UserToken {
  @PrimaryGeneratedColumn({ type: "int", name: "user_token_id", unsigned: true })
  userTokenId: number;

  @Column("int", { name: "user_id", unique: true})
  userId: number;

  @Column("timestamp", { name: "created_at"})
  createdAt: string;

  @Column("text", { name: "token"})
  @Validator.IsNotEmpty()
  @Validator.IsString()
  token: string;

  @Column("datetime", { name: "expires_at"})
  expiresAt: string;

  @Column( {type:"tinyint", name: "is_valid",default:1})
  @Validator.IsNotEmpty()
  @Validator.IsIn([0,1])
  isValid: number;



}
