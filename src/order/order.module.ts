import { Module } from '@nestjs/common';
import { DatabaseModule } from '../database/database.module';
import { Order, orderSchema } from './order.model';
import { OrderResolver } from './order.resolver';
import { OrderService } from './order.service';
import { OrderRepository } from './order.repository';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Order.name, schema: orderSchema }]),
  ],
  providers: [OrderResolver, OrderService, OrderRepository],
})
export class OrderModule {}
