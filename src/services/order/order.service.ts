import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "../../../entities/Cart";
import { Repository } from "typeorm";
import { CartArticle } from "../../../entities/CartArticle";
import { Article } from "../../../entities/Article";
import { Order } from "../../../entities/Order";
import { ApiResponse } from "../../mlnsc/api/response.class";

@Injectable()
export class OrderService {

  constructor(
    @InjectRepository(Cart)
    private readonly cart: Repository<Cart>,
    @InjectRepository(Order)
    private readonly order: Repository<Order>,
  ) {
  }

  async makeOrder(cartId:number):Promise<Order |ApiResponse>{

    const order=await this.order.findOne({where:{
      cartId:cartId
    }})

    if(order){
      throw new ApiResponse("error",-7001,"Order for this cart not exist");
    }

    const cart=await this.cart.findOne(
      {
        where:{cartId},
        relations:[
        "cartArticles",
      ]})
    if(!cart){
      throw new ApiResponse("error",-7002,"Cart not found");
    }

    if(cart.cartArticles.length===0){
      throw new ApiResponse("error",-7003,"Cart is empty");
    }
      const newOrder:Order=new Order();
      newOrder.cartId=cartId;
      let savedOrder=await this.order.save(newOrder);

    cart.createdAt = new Date();
    await this.cart.save(cart);

    return await this.getById(savedOrder.orderId);
  }

  async getById(orderId:number){

    return await this.order.findOne({where:{orderId},
      relations:[
        "cart",
        "cart.user",
        "cart.cartArticles",
        "cart.cartArticles.article",
        "cart.cartArticles.article.category",
        "cart.cartArticles.article.articlePrices",
      ]}
    );
  }

}