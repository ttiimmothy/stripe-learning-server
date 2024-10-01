import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import {AuthGuard} from "../auth/auth.guard";

@Module({
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}
