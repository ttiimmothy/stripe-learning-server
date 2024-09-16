import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DeleteProductResponse {
  @Field(() => String)
  message: string;
}
