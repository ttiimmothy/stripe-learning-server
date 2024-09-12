import {UserType, UserWithoutMethods} from "./user.type";

export function generateUser(user: UserWithoutMethods): UserType {
  return {
    _id: user.id,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    bio: user.bio,
    profession: user.profession
  } 
}