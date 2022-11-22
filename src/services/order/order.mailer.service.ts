import { Injectable } from "@nestjs/common";
import { Order } from "../../../entities/Order";
import { MailerService } from "@nestjs-modules/mailer";
import { MailConfig } from "../../../config/mail.config";
import { CartArticle } from "../../../entities/CartArticle";
//xitudlvmfyilvjrt
//xrwmvdnswfyjjmnp
@Injectable()
export class OrderMailerService{
    constructor(private readonly  mailService:MailerService) {
    }
    async sendOrderEmail(order:Order){
    await this.mailService.sendMail({
        to:order.cart.user.email,
        bcc:MailConfig.orderNotificationMail,
        subject:'Order-details',
        encoding:'UTF-8',
        html: this.makeOrderHtml(order),
    });
    }

    private makeOrderHtml(order:Order):string{
        let suma=order.cart.cartArticles.reduce((sum,current:CartArticle)=>{
            return sum +
               current.quantity *
               current.article.articlePrices[current.article.articlePrices.length-1].price
        },0)

        return `
          <p>Zahvaljujemo se za vašu narudžbu</p>
          <p>Ovo su detalji narudžbe:</p>
          <ul>
               ${order.cart.cartArticles.map((cartArticle:CartArticle)=>{
                return `<li>
                         ${cartArticle.article.name}x
                         ${cartArticle.quantity}
                      </li>`;
            }).join("")}
           </ul>
            <p>Ukupan iznos je: ${suma}Eur</p>`
    }
}