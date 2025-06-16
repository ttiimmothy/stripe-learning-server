import { Body, Controller, Headers, Post, Res } from '@nestjs/common';
import { WebhookService } from './webhook.service';
import {ConfigService} from "@nestjs/config";

@Controller('api/v1/stripe')
export class WebhookController {
  constructor(private readonly webhookService: WebhookService, private configService: ConfigService) {}

  @Post('/webhook')
  webhook(@Body() body, @Headers() headers, @Res() response) {
    const event = body;
    const endpointSecret = this.configService.getOrThrow<string>("STRIPE_WEBHOOK_KEY");
    if (endpointSecret) {
      try {
        this.webhookService.webhook(event, endpointSecret, body, headers);
      } catch (error) {
        console.log(`⚠️  Webhook signature verification failed.`, error.message);
        return response.sendStatus(400);
      }
    }
    // code 200
    response.send();
  }
}
