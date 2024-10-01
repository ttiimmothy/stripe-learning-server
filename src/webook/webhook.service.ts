/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import Stripe from "stripe"

@Injectable()
export class WebhookService {
  constructor() {}

  webhook(event: any, secret: string, body: any, headers: any) {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const signature = headers['signature-secret'];
    event = stripe.webhooks.constructEvent(body, signature, secret);
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        console.log(
          `PaymentIntent for ${paymentIntent.amount} was successful!`,
        );
        break;
      case 'payment_method.attached':
        const paymentMethod = event.data.object;
        break;
      case 'charge.succeeded':
        const chargeSucceeded = event.data.object;
        
      case 'checkout.session.completed':
        const checkoutSessionCompleted = event.data.object;
      default:
        console.log(`Unhandled event type ${event.type}.`);
    }
  }
}
