import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { Cart } from "../../../entities/Cart";
import { InjectRepository } from "@nestjs/typeorm";
import { CartArticle } from "../../../entities/CartArticle";
import { Article } from "../../../entities/Article";
import { Order } from "../../../entities/Order";
import { EditQuantityInCartDto } from "../../dtos/cart/edit.quantity.in.cart.dto";
import { ApiResponse } from "../../mlnsc/api/response.class";


@Injectable()
export class CartService {

  constructor(
    @InjectRepository(Cart)
    private readonly cart: Repository<Cart>,
    @InjectRepository(CartArticle)
    private readonly cartArticle: Repository<CartArticle>,

  ) {
  }

    async getLastCartByUserId(userId:number): Promise<Cart | null>{
      const carts=await this.cart.find({
        where:{
        userId:userId
        },
        order:{
            createdAt:"DESC",
        },
        take:1,
        relations:["order"],
      });

      console.log(carts)

      if(!carts||carts.length===0){
        return null;
      }

      const lastCart=carts[0];

      if(lastCart.order!==null){
        return null
      }

      return lastCart;
    }

    async  createNewCartForUser(userId:number):Promise<Cart>{

        const newCart:Cart=new Cart();
        newCart.userId=userId;

        return await this.cart.save(newCart);
    }

    async addArticleToCart(cartId:number,articleId:number,quantity:number):Promise<Cart>{
      let record:CartArticle=await this.cartArticle.findOne({where:{
          cartId:cartId,
          articleId:articleId
        }})

      if(!record){
          record=new CartArticle();
          record.cartId=cartId;
          record.articleId=articleId;
          record.quantity=quantity;
      }else{
        record.quantity+=quantity;
      }

      await this.cartArticle.save(record);
      return this.getById(cartId)
    }

    async getById(cartId:number):Promise<Cart>{

    return await this.cart.findOne({where:{cartId},
        relations:[
          "user",
          "cartArticles",
          "cartArticles.article",
          "cartArticles.article.category",
          "cartArticles.article.articlePrices"
        ]}
      );
    }

    async editQuantityInCart(cartId:number,articleId:number,newQuantity:number):Promise<Cart>{

      let record:CartArticle=await this.cartArticle.findOne({where:{
          cartId:cartId,
          articleId:articleId
        }})

        if(record){

        record.quantity=newQuantity;

        if(record.quantity===0){
          await this.cartArticle.delete(record.cartArticleId);
        }else{
          await this.cartArticle.save(record);
         }
        }

      return await this.getById(cartId);
    }


}
