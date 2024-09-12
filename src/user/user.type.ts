import {IUser, IUserMethods} from "./user.model.extra";

export type UserWithoutMethods = Omit<IUser, keyof IUserMethods>;

export type UserType = {
  _id: string;
  username: string;
  email: string;
  role: string;
  profilePicture?: string;
  bio?: string;
  profession?: string;
}