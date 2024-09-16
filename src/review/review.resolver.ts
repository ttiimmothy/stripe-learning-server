import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ReviewService} from "./review.service";
import {Review} from "./review.model";
import {CreateReviewResponse} from "./dto/create-review.response";
import {CreateReviewInput} from "./dto/create-review.input";
import {ReviewsCountResponse} from "./dto/reviewsCount.response";
import {ReviewByIdResponse} from "./dto/reviewById.response";
import {ReviewsType} from "../product/dto/get-product.response";

@Resolver(() => Review)
export class ReviewResolver{
  constructor(private readonly reviewService:ReviewService){}

  @Query(() => [Review])
  reviews() {
    try {
      return this.reviewService.reviews();
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => CreateReviewResponse)
  create(@Args("createReviewInput") createReviewInput: CreateReviewInput) {
    try {
      return this.reviewService.createReview(createReviewInput);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => ReviewsCountResponse)
  reviewsCount() {
    try {
      return this.reviewService.reviewsCount();
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [ReviewsType])
  reviewsUser(@Args("userId") userId: string) {
    try {
      return this.reviewService.reviewsByUserId(userId);
    } catch (error) {
      throw error;
    }
  }
}