import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { Order } from './order.model';
import { OrderService } from './order.service';
import { CheckoutResponse } from './dto/checkout.response';
import { CheckoutProductInput } from './dto/checkout.input';
import {UseGuards} from "@nestjs/common";
import {AuthGuard} from "../auth/auth.guard";

@Resolver(() => Order)
export class OrderResolver {
  constructor(private readonly orderService: OrderService) {}

  @UseGuards(AuthGuard)
  @Mutation(() => CheckoutResponse)
  // cannot use an array as the args
  async checkout(
    @Args('checkoutProducts') checkoutProducts: CheckoutProductInput,
  ) {
    return this.orderService.checkout(checkoutProducts);
  }

  @Mutation(() => Order)
  async confirmPayment(@Args("sessionId") sessionId: string) {
    return this.orderService.confirmPayment(sessionId)
  }
}
