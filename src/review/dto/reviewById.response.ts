import { Field, ObjectType } from '@nestjs/graphql';
import { ReviewsType } from '../../product/dto/get-product.response';

@ObjectType()
export class ReviewByIdResponse {
  @Field(() => [ReviewsType])
  review: ReviewsType[];
}
