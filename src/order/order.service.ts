import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {OrderRepository} from "./order.repository";
import {CheckoutProductInput} from "./dto/checkout.input";

@Injectable()
export class OrderService {
  constructor(private readonly orderRepositoy:OrderRepository) {}

  async checkout(checkoutProducts:CheckoutProductInput) {
    try {
      const {products} = checkoutProducts;
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
      const lineItems = products.map((product) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: product.quantity,
      }))
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`
      });
      return {id:session.id, url:session.url}
    } catch (error) {
      throw new InternalServerErrorException("Error creating checking session")
    }
  }
}