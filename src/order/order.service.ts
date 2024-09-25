import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { OrderRepository } from './order.repository';
import { CheckoutProductInput } from './dto/checkout.input';

@Injectable()
export class OrderService {
  constructor(private readonly orderRepositoy: OrderRepository) {}

  async checkout(checkoutProducts: CheckoutProductInput) {
    try {
      const { products } = checkoutProducts;
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
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
      const session = await stripe.checkout.sessions.create({
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
        // automatic_tax: { enabled: true },
        // custom_text: {
        //   tax_label: 'GST (13%)',
        // },
        success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.FRONTEND_URL}/cancel`,
      });
      console.log(session.client_secret)
      console.log(session)
      return { id: session.id, url: session.url };
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating checking session');
    }
  }
}
