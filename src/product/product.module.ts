import { forwardRef, Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductResolver } from './product.resolver';
import { ProductRepository } from './product.repository';
import { Product, productSchema } from './product.model';
import { DatabaseModule } from '../database/database.module';
import { ReviewModule } from '../review/review.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    DatabaseModule.forFeature([{ name: Product.name, schema: productSchema }]),
    forwardRef(() => ReviewModule),
    UserModule,
  ],
  providers: [ProductService, ProductResolver, ProductRepository],
  exports: [ProductRepository],
})
export class ProductModule {}
