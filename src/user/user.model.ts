import { Types, SchemaTypes } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import bcrypt from 'bcrypt';

@ObjectType()
export class User {
  @Field(() => ID)
  _id: Types.ObjectId;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field({ nullable: true })
  password?: string;

  @Field()
  role: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  profession?: string;

  @Field({ nullable: true })
  createdAt?: Date;
}

@Schema()
export class UserDocument {
  @Prop({ type: SchemaTypes.ObjectId })
  _id: Types.ObjectId;

  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: 'user' })
  role: string;

  @Prop({ default: null })
  profilePicture?: string;

  @Prop({ default: null })
  bio?: string;

  @Prop({ default: null })
  profession?: string;

  @Prop({ default: Date.now })
  createdAt: Date;
}

export const userSchema = SchemaFactory.createForClass(UserDocument);
export type CreateUserDocument = Omit<
  UserDocument,
  '_id' | 'role' | 'createdAt'
>;

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
