import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { Review } from './review.model';
import { CreateReviewInput } from './dto/create-review.input';
// import { assertWrappingType } from 'graphql';
import { ProductRepository } from '../product/product.repository';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly productRepository: ProductRepository,
  ) {}

  async find(productId: string): Promise<Review[]> {
    try {
      return this.reviewRepository.find({ productId });
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting reviews');
    }
  }

  async reviewsCount(): Promise<{ totalReviews: number }> {
    try {
      const totalReviews = await this.reviewRepository.countDocuments({});
      return { totalReviews };
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to get reviews count');
    }
  }

  async reviews(): Promise<Review[]> {
    try {
      return this.reviewRepository.find({});
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException('Error getting reviews');
    }
  }

  async createReview(
    createReviewInput: CreateReviewInput,
  ): Promise<{ message: string; reviews: Review[] }> {
    try {
      const { comment, rating, productId, userId } = createReviewInput;
      if (!comment || !rating || !userId || !productId) {
        throw new BadRequestException('All fields are required');
      }
      const existingReview = await this.reviewRepository.findOne({
        productId,
        userId,
      });
      if (existingReview) {
        existingReview.comment = comment;
        existingReview.rating = rating;
        await this.reviewRepository.findByIdAndUpdate(
          existingReview._id,
          existingReview,
        );
      } else {
        await this.reviewRepository.create({
          comment,
          rating,
          productId,
          userId,
        });
      }
      const reviews = await this.reviewRepository.find({ productId });
      if (reviews.length > 0) {
        const totalRating = reviews.reduce(
          (acc, review) => acc + review.rating,
          0,
        );
        const averageRating = totalRating / reviews.length;
        const product = await this.productRepository.findById(
          String(productId),
        );
        if (product) {
          product.rating = averageRating;
          await this.productRepository.findByIdAndUpdate(product._id, product);
        } else {
          throw new NotFoundException('Product not found');
        }
      }
      return { message: 'Review processed successfully', reviews };
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException('Error creating review');
    }
  }

  // get reviews by user id
  async reviewsByUserId(userId: string): Promise<Review[]> {
    try {
      if (!userId) {
        throw new BadRequestException('User Id is required');
      }
      const reviews = await this.reviewRepository.find(
        { userId },
        {
          sort: { createdAt: -1 },
          populate: { path: 'userId', select: 'email username role' },
        },
      );
      if (reviews.length === 0) {
        throw new NotFoundException('No reviews found for the user');
      }
      return reviews;
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch reviews by user id',
      );
    }
  }

  async reviewsByProductId(productId: string): Promise<Review[]> {
    try {
      if (!productId) {
        throw new BadRequestException('Product Id is required');
      }
      const reviews = await this.reviewRepository.find(
        { productId },
        {
          sort: { createdAt: -1 },
          populate: { path: 'userId', select: 'email username role' },
        },
      );
      console.log(reviews);
      if (reviews.length === 0) {
        throw new NotFoundException('No reviews found for the product');
      }
      return reviews;
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException(
        'Failed to fetch reviews by product id',
      );
    }
  }
}
