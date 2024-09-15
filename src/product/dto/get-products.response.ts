import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Product} from "../product.model";
import {User} from "../../user/user.model";
import {Types} from "mongoose";
import {ProductType} from "./get-product.response";

@ObjectType()
export class UserId {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field()
  email: string;
}
@ObjectType()
export class ProductsType {
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
  @Field(() => UserId)
  author: UserId;
  @Field()
  createdAt: Date;
  @Field()
  updatedAt: Date;
}

@ObjectType()
export class GetProductsResponse{
  @Field(() => [ProductType])
  products: ProductType[];

  @Field()
  totalPages: number;

  @Field()
  totalProducts: number;
}