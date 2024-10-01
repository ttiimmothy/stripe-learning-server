import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { SchemaTypes, Types } from 'mongoose';

@ObjectType()
class ProductOrder {
  @Field()
  productId: string;

  @Field()
  quantity: number;
}

@ObjectType()
@Schema()
export class Order {
  @Field(() => ID)
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Field()
  @Prop()
  orderId: string;

  @Field(() => [ProductOrder])
  @Prop()
  products: ProductOrder[];

  @Field()
  @Prop()
  amount: number;

  @Field()
  @Prop()
  email: string;

  @Field()
  @Prop({
    enum: ['pending', 'processing', 'shipped', 'completed'],
    default: 'pending',
  })
  status: string;

  @Field({nullable: true})
  @Prop({ default: Date.now() })
  createdAt?: Date;

  @Field({nullable: true})
  @Prop({ default: Date.now() })
  updatedAt?: Date;
}

export const orderSchema = SchemaFactory.createForClass(Order);
