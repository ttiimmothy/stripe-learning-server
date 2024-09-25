import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ReviewService } from './review.service';
import { Review } from './review.model';
import { CreateReviewResponse } from './dto/create-review.response';
import { CreateReviewInput } from './dto/create-review.input';
import { ReviewsCountResponse } from './dto/reviewsCount.response';
// import { ReviewByIdResponse } from './dto/reviewById.response';
import { ReviewsType } from '../product/dto/get-product.response';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [Review])
  reviews() {
    return this.reviewService.reviews();
  }

  @Mutation(() => CreateReviewResponse)
  create(@Args('createReviewInput') createReviewInput: CreateReviewInput) {
    return this.reviewService.createReview(createReviewInput);
  }

  @Query(() => ReviewsCountResponse)
  reviewsCount() {
    return this.reviewService.reviewsCount();
  }

  @Query(() => [ReviewsType])
  reviewsUser(@Args('userId') userId: string) {
    return this.reviewService.reviewsByUserId(userId);
  }
}
