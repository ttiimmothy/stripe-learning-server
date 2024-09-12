import { ObjectType, Field } from "@nestjs/graphql";
import { User } from "../user.model";

@ObjectType()
export class UpdateUserRoleResponse {
  @Field(() => String)
  message: string;
  @Field(() => User)
  user: User;
}