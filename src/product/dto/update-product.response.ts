import { Field, ObjectType } from '@nestjs/graphql';
import { Product } from '../product.model';

@ObjectType()
export class UpdateProductResponse {
  @Field()
  message: string;
  @Field(() => Product)
  product: Product;
}
