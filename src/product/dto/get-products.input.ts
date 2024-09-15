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
  @IsString()
  minPrice: string;
  
  @Field({nullable: true})
  @IsString()
  maxPrice: string;

  @Field({nullable: true})
  @IsString()
  page: string;

  @Field({nullable: true})
  @IsString()
  limit: string;
}

@InputType()
export class GetProductByIdInput{
  @Field()
  @IsString()
  _id: string;
}