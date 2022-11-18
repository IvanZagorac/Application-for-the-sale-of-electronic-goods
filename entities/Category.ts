import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Article } from "./Article";
import { Feature } from "./Feature";
import *  as Validator from 'class-validator'

@Index("uq_categoty_name", ["name"], { unique: true })
@Index("uq_category_path", ["imagePath"], { unique: true })
@Index("parent__category_id", ["parentCategoryId"], {})
@Entity("category", { schema: "web_app" })
export class Category {
  @Column("int", { primary: true, name: "category_id", unsigned: true })
  categoryId: number;

  @Column("varchar", { name: "name", unique: true, length: 32 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,32)
  name: string;

  @Column("varchar", { name: "image_path", unique: true, length: 128 })
  imagePath: string;

  @Column("int", {
    name: "parent__category_id",
    nullable: true,
    unsigned: true,
  })
  parentCategoryId: number | null;

  @OneToMany(() => Article, (article) => article.category)
  articles: Article[];

  @ManyToOne(() => Category, (category) => category.categories, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([
    { name: "parent__category_id", referencedColumnName: "categoryId" },
  ])
  parentCategory: Category;

  @OneToMany(() => Category, (category) => category.parentCategory)
  categories: Category[];

  @OneToMany(() => Feature, (feature) => feature.category)
  features: Feature[];
}
