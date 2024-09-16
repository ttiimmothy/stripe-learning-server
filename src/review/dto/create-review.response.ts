import { Field, ObjectType } from '@nestjs/graphql';
import { Review } from '../review.model';

@ObjectType()
export class CreateReviewResponse {
  @Field(() => String)
  message: string;

  @Field(() => [Review])
  reviews: Review[];
}
