import {
  Column,
  Entity,
  Index,
  JoinColumn, JoinTable, ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { ArticleFeature } from "./ArticleFeature";
import { Category } from "./Category";
import { Article } from "./Article";
import *  as Validator from 'class-validator'

@Index("uq_feature_category_id_name", ["name", "categoryId"], { unique: true })
@Index("fk_feature_category_id", ["categoryId"], {})
@Entity("feature", { schema: "web_app" })
export class Feature {
  @PrimaryGeneratedColumn({ type: "int", name: "feature_id", unsigned: true })
  featureId: number;

  @Column("varchar", { name: "name", length: 32 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(5,32)
  name: string;

  @Column("int", { name: "category_id", unsigned: true })
  categoryId: number;

  @OneToMany(() => ArticleFeature, (articleFeature) => articleFeature.feature)
  articleFeatures: ArticleFeature[];

  @ManyToMany(type=>Article,article=>article.features)
  @JoinTable({
    name: "article_feature",
    joinColumn: { name:"feature_id", referencedColumnName:"featureId"},
    inverseJoinColumn: { name:"article_id", referencedColumnName: "articleId"}
  })
  articles:Article[];

  @ManyToOne(() => Category, (category) => category.features, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;
}
