import {
  Column,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Cart } from "./Cart";

@Index("Unique", ["email"], { unique: true })
@Index("phone-un", ["phoneNumber"], { unique: true })
@Entity("user", { schema: "web_app" })
export class User {
  @PrimaryGeneratedColumn({ type: "int", name: "user_id", unsigned: true })
  userId: number;

  @Column("varchar", { name: "email", unique: true, length: 255 })
  email: string;

  @Column("varchar", { name: "password_hash", length: 128 })
  passwordHash: string;

  @Column("varchar", { name: "name", length: 64 })
  name: string;

  @Column("varchar", { name: "surname", length: 64 })
  surname: string;

  @Column("varchar", { name: "phone_number", unique: true, length: 24 })
  phoneNumber: string;

  @Column("tinytext", { name: "postal_adress" })
  postalAdress: string;

  @OneToMany(() => Cart, (cart) => cart.user)
  carts: Cart[];
}
