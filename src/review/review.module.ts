import { forwardRef, Module } from '@nestjs/common';
import { ReviewRepository } from './review.repository';
import { Review, reviewSchema } from './review.model';
// import { MongooseModule } from '@nestjs/mongoose';
import { DatabaseModule } from '../database/database.module';
import { ReviewService } from './review.service';
import { ReviewResolver } from './review.resolver';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Review.name, schema: reviewSchema }]),
    forwardRef(() => ProductModule),
  ],
  providers: [ReviewService, ReviewResolver, ReviewRepository],
  exports: [ReviewRepository],
})
export class ReviewModule {}
