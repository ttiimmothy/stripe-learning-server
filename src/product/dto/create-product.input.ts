import {Field, ID, InputType} from "@nestjs/graphql";
import {IsNotEmpty, IsString, IsNumber, IsMongoId, IsOptional} from "class-validator";
import {Types} from "mongoose";
import {User} from "../../user/user.model";

@InputType()
export class CreateProductInput{
  @Field()
  @IsNotEmpty()
  @IsString()
  name: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  category: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  description: string;
  
  @Field()
  @IsNotEmpty()
  @IsNumber()
  price: number;
  
  @Field({nullable: true})
  @IsNumber()
  @IsOptional()
  oldPrice?: number;

  @Field()
  @IsNotEmpty()
  @IsString()
  image: string;

  @Field()
  @IsNotEmpty()
  @IsString()
  color: string;

  // need to set nullable to true
  @Field({nullable: true})
  @IsNumber()
  @IsOptional()
  rating?: number;

  @Field(() => ID)
  @IsNotEmpty()
  @IsMongoId()
  author: Types.ObjectId
}