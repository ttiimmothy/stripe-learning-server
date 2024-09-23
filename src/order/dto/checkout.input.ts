import {Field, ID, InputType} from "@nestjs/graphql";
import {IsNumber} from "class-validator";
import {Types} from "mongoose";

@InputType()
class OrderUser {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field()
  email: string;
  @Field()
  role: string;
}

@InputType()
export class Products {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field()
  name: string;
  @Field()
  category: string;
  @Field()
  description: string;
  @Field()
  price: number;
  @Field({ nullable: true })
  oldPrice?: number;
  @Field()
  image: string;
  @Field()
  color: string;
  @Field()
  rating: number;
  @Field(() => OrderUser)
  author: OrderUser;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
  @Field()
  @IsNumber()
  quantity: number
}

@InputType()
export class CheckoutProductInput {
  @Field(() => [Products])
  products: Products[]
}