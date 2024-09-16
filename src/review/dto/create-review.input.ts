import {InputType, Field, ID} from "@nestjs/graphql";
import {Types} from "mongoose";

@InputType()
export class CreateReviewInput{
  @Field(() => String)
  comment: string;
  @Field()
  rating: number;
  @Field(() => ID)
  userId: Types.ObjectId;
  @Field(() => ID)
  productId: Types.ObjectId;
}