import { ObjectType, Field } from '@nestjs/graphql';
import { User } from '../user.model';

@ObjectType()
export class LoginResponse {
  @Field()
  message: string;

  @Field()
  token: string;

  @Field(() => User)
  user: User;
}