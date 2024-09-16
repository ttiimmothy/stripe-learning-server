import {Field, ID, ObjectType} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {SchemaTypes, Types} from "mongoose";
import {Product} from "../product/product.model";
import {User} from "../user/user.model";

@ObjectType()
export class Review {
  @Field(() => ID)
  _id: Types.ObjectId;
  @Field()
  comment: string;
  @Field()
  rating: number;
  @Field(() => ID)
  userId: Types.ObjectId;
  @Field(() => ID)
  productId: Types.ObjectId;
  @Field({nullable: true})
  createdAt?: Date;
  @Field({nullable: true})
  updatedAt?: Date;
}

// @Schema({versionKey: false})
@Schema()
export class ReviewDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true })
  comment: string;
  @Prop({ required: true })
  rating: number;
  @Prop({ type: Types.ObjectId, ref: User.name, required: true })
  userId: Types.ObjectId;
  @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
  productId: Types.ObjectId;
  @Prop({default: Date.now})
  createdAt?: Date;
  @Prop({default: Date.now})
  updatedAt?: Date;
}

export const reviewSchema = SchemaFactory.createForClass(ReviewDocument);