import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Product} from "../product.model";
import {User} from "../../user/user.model";
import {Types} from "mongoose";
import {Review} from "../../review/review.model";

@ObjectType()
export class AuthorType {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field()
  email: string;
  @Field()
  username: string;
}

@ObjectType()
export class UserIdType {
  @Field(() => ID, {nullable: true})
  _id: Types.ObjectId;
  @Field({nullable: true})
  email: string;
  @Field({nullable: true})
  username: string;
}


@ObjectType()
export class ProductType {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field()
  name: string;
  @Field()
  category: string;
  @Field()
  description: string;
  @Field()
  price: number;
  @Field({nullable: true})
  oldPrice?: number;
  @Field()
  image: string;
  @Field()
  color: string;
  @Field()
  rating: number;
  @Field(() => User)
  author: User;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}

@ObjectType()
export class ReviewsType {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field()
  comment: string;
  @Field()
  rating: number;
  @Field(() => User)
  userId: User;
  @Field(() => ID)
  productId: Types.ObjectId;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}
@ObjectType()
export class GetProductResponse {
  @Field(() => ProductType)
  product: ProductType;
  @Field(() => [ReviewsType])
  reviews: ReviewsType[];
}
