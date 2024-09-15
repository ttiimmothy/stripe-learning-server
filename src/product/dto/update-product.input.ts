import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UpdateProductInput {
  @Field({nullable: true})
  name: string;

  @Field({nullable: true})
  category: string;
  @Field({nullable: true})
  description: string;
  @Field({nullable: true})
  price: number;
  @Field({nullable: true})
  oldPrice: number;
  @Field({nullable: true})
  image: string;
  @Field({nullable: true})
  color: string;
}