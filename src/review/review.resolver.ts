import {Args, Mutation, Query, Resolver} from "@nestjs/graphql";
import {ReviewService} from "./review.service";
import {Review} from "./review.model";

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
}