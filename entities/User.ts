import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";
import *  as Validator from 'class-validator'

@Index("Unique", ["email"], { unique: true })
@Index("phone-un", ["phoneNumber"], { unique: true })
@Entity("user", { schema: "web_app" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  @Validator.IsNotEmpty()
  @Validator.IsEmail({
    allow_ip_domain:false,
    allow_utf8_local_part:false
  })
  email: string;

  @Column("varchar", { name: "password_hash", length: 128 })
  @Validator.IsNotEmpty()
  @Validator.IsHash('sha512')
  passwordHash: string;

  @Column("varchar", { name: "name", length: 64 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,32)
  name: string;

  @Column("varchar", { name: "surname", length: 64 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3,32)
  surname: string;

  @Column("varchar", { name: "phone_number", unique: true, length: 24 })
  @Validator.IsNotEmpty()
  @Validator.IsPhoneNumber()
  phoneNumber: string;

  @Column("tinytext", { name: "postal_adress" })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(10,512)
  postalAdress: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
