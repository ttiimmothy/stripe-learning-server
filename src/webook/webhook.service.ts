import { Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import Stripe from "stripe"
import {OrderRepository} from "../order/order.repository";

@Injectable()
export class WebhookService {
  constructor(private readonly orderRepositoy: OrderRepository) {}

  async webhook(event: any, secret: string, body: any, headers: any) {
    try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const signature = headers['signature-secret'];
    event = stripe.webhooks.constructEvent(body, signature, secret);
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(`PaymentIntent for ${paymentIntent.amount} was successful`);
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        console.log(paymentMethod)
        break;
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object
        console.log(chargeSucceeded)
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object
        const session = await stripe.checkout.sessions.retrieve(checkoutSessionCompleted.id, {
          expand: ["line_items", "payment_intent"]
        })
        let paymentIntentId;
        if (!session.payment_intent || typeof session.payment_intent !== 'object') {
        // if (session.payment_intent && typeof session.payment_intent === 'object') {
          throw new UnauthorizedException("Cannot get the payment intent from checkout session")
        }
        paymentIntentId = session.payment_intent.id;
        let order = await this.orderRepositoy.findOne({orderId: paymentIntentId})
        if (!order) {
          const lineItems = session.line_items.data.map((item) => ({
            productId: item.price.product,
            quantity: item.quantity,
          }))
          const amount = session.amount_total / 100
          const newOrder = {
            orderId: paymentIntentId,
            products: lineItems,
            amount,
            email: session.customer_details.email,
            status: session.payment_intent.status === "succeeded" ? "pending" : "failed",
          }
        }
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    } catch (e) {
      if (!(e instanceof InternalServerErrorException)) {
        throw e;
      }
      throw new InternalServerErrorException("Failed to get the responses in the webhook")
    }
  }
}
