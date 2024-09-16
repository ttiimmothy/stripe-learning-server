import {User} from "../user/user.model";
import {Field, ID, ObjectType, Float} from "@nestjs/graphql";
import {Prop, Schema, SchemaFactory} from "@nestjs/mongoose";
import {Types, Document, SchemaTypes} from "mongoose";

// Product and ProductDocument can have different properties
@ObjectType()
export class Product {
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
  // @Field(() => User)
  // author: User;
  @Field(() => ID)
  author: Types.ObjectId;
  @Field({nullable: true})
  createdAt?: Date;
  @Field({nullable: true})
  updatedAt?: Date;
}

// @Schema({timestamps: true, versionKey: false})
// @Schema({versionKey: false})
@Schema()
export class ProductDocument {
  // schematypes.objectid is used to create a new objectid
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;
  @Prop({ required: true })
  name: string;
  @Prop({ required: true })
  category: string;
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  price: number;
  @Prop({nullable: true})
  oldPrice?: number;

  @Prop({ required: true })
  image: string;

  @Prop({ required: true })
  color: string;

  @Prop({default: 0}) 
  rating: number;

  // @Prop({ types: User, ref: User.name, required: true })
  // author: User;
  @Prop({ types: Types.ObjectId, ref: User.name, required: true })
  author: Types.ObjectId;
  @Prop({default: Date.now})
  createdAt?: Date;
  @Prop({default: Date.now})
  updatedAt?: Date;
}

export const productSchema = SchemaFactory.createForClass(ProductDocument);