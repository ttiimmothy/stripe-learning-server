import { InputType, Field } from "@nestjs/graphql";

@InputType()
export class UpdateUserRoleInput {
  @Field(() => String)
  userId: string;
  @Field(() => String)
  role: string;
}