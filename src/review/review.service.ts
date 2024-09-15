import {Injectable, InternalServerErrorException} from "@nestjs/common";
import {ReviewRepository} from "./review.repository";
import {Review} from "./review.model";

@Injectable()
export class ReviewService{
  constructor(private readonly reviewRepository: ReviewRepository){}

  async find(productId: string):Promise<Review[]>{
    try {
      return this.reviewRepository.find({productId});
    } catch (error) {
      throw new InternalServerErrorException("Error getting reviews");
    }
  }

  async reviews(): Promise<Review[]>{
    try {
      return this.reviewRepository.find({});
    } catch (error) {
      throw new InternalServerErrorException("Error getting reviews");
    }
  }
}