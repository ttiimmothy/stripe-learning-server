import { InputType, Field } from '@nestjs/graphql';
// import { Types } from 'mongoose';

@InputType()
export class EditProfileInput {
  @Field()
  userId: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  profilePicture?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  profession?: string;
}
