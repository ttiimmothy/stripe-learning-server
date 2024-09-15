import {Field, ObjectType} from "@nestjs/graphql";
@ObjectType()
export class CreateUserResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class LogoutResponse {
  @Field(() => String)
  message: string;
}

@ObjectType()
export class DeleteUserResponse {
  @Field(() => String)
  message: string;
}
