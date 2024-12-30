import Stripe from "stripe";

export type StripeOrder = string | Stripe.Product | Stripe.DeletedProduct