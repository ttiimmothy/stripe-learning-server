import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import {AuthGuard} from "../auth/auth.guard";
import {OrderModule} from "../order/order.module";

@Module({
  imports: [OrderModule],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
