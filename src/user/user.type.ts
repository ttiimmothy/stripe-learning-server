import { Types } from 'mongoose';

export type UserType = {
  _id: string | Types.ObjectId;
  username: string;
  email: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  profession?: string;
};
