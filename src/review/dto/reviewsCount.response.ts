import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class ReviewsCountResponse {
  @Field(() => Number)
  totalReviews: number;
}
