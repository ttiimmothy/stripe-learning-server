import {Field, InputType} from "@nestjs/graphql";
import {IsString, IsNumber} from "class-validator";
@InputType()
export class GetProductsInput{
  @Field({nullable: true})
  @IsString()
  category: string;

  @Field({nullable: true})
  @IsString()
  color: string;

  @Field({nullable: true})
  @IsNumber()
  minPrice: number;
  
  @Field({nullable: true})
  @IsNumber()
  maxPrice: number;

  @Field({nullable: true})
  @IsNumber()
  page: number;

  @Field({nullable: true})
  @IsNumber()
  limit: number;
}

@InputType()
export class GetProductByIdInput{
  @Field()
  @IsString()
  _id: string;
}