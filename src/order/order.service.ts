import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CheckoutProductInput } from './dto/checkout.input';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}
  stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

  async checkout(checkoutProducts: CheckoutProductInput) {
    try {
      const { products } = checkoutProducts;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const paymentIntentMetadata = products.map((product) => ({
        _id: product._id,
        quantity: product.quantity,
      }));
      const lineItems = products.map((product) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: product.name,
            images: [product.image],
          },
          unit_amount: Math.round(product.price * 100),
        },
        // 13% tax rate
        // cannot show % in the bracket, so not using fixed tax rate id
        tax_rates: [process.env.STRIPE_TAX_RATE_ID],
        quantity: product.quantity,
      }));
      const session = await this.stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        payment_intent_data: {
          // metadata can have up to 500 characters
          metadata: {
            cartItems: JSON.stringify(paymentIntentMetadata),
          },
        },
        shipping_options: [
          {
            shipping_rate: process.env.STRIPE_SHIPPING_RATE_ID,
          },
        ],
        shipping_address_collection: {
          allowed_countries: ['CA'], // Only allow shipping to Canada
        },
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      })
      return { id: session.id, url: session.url, clientSecret: session.client_secret };
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating checking session');
    }
  }

  async confirmPayment(sessionId: string) {
    try {
    const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
      expand: ["line_items", "payment_intent"]
    })
    const paymentIntentId = session.payment_intent_id
    let order = await this.orderRepository.findOne({orderId:paymentIntentId})
    if(!order){
      const lineItems = session.line_items.data.map((item) => ({
        productId: item.price.product,
        quantity: item.quantity,
      }));

      const amount = session.amount_total / 100;
      order = await this.orderRepository.create({
        orderId: paymentIntentId,
        products: lineItems,
        amount: amount,
        email: session.customer_details.email,
        status: session.payment_intent.status === "succeeded" ? "pending" : "failed"
      })
    } else {
      order.status = session.payment_intent.status === "succeeded" ? "pending" : "failed";
    }
    return order
    } catch (error) {
      throw new InternalServerErrorException('Error confirming payment');
    }
  }
}
