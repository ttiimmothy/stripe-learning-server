import {Field, ObjectType} from "@nestjs/graphql";

@ObjectType()
export class CheckoutResponse {
  @Field()
  id: string;

  @Field()
  url: string
}