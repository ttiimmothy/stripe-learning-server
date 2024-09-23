import {Args, Mutation, Resolver} from "@nestjs/graphql";
import {Order} from "./order.model";
import {OrderService} from "./order.service";
import {CheckoutResponse} from "./dto/checkout.response";
import {CheckoutProductInput} from "./dto/checkout.input";

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService:OrderService) {}

  @Mutation(() => CheckoutResponse)
  // cannot use CheckoutProductInput[]
  async checkout(@Args("checkoutProducts") checkoutProducts:CheckoutProductInput) {
    return this.orderService.checkout(checkoutProducts)
  }
}