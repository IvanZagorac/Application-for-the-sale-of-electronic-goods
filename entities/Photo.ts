import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Article } from "./Article";
import *  as Validator from 'class-validator'

@Index("uq_photo_path", ["imagePath"], { unique: true })
@Index("fk_photo_article_id", ["articleId"], {})
@Entity("photo", { schema: "web_app" })
export class Photo {
  @PrimaryGeneratedColumn({ type: "int", name: "photo_id", unsigned: true })
  photoId: number;

  @Column("int", { name: "article_id", unsigned: true })
  articleId: number;

  @Column("varchar", { name: "image_path", unique: true, length: 128 })
  imagePath: string;

  @ManyToOne(() => Article, (article) => article.photos, {
    onDelete: "RESTRICT",
    onUpdate: "CASCADE",
  })
  @JoinColumn([{ name: "article_id", referencedColumnName: "articleId" }])
  article: Article;
}
