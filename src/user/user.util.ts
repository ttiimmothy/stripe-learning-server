import { UserDocument } from './user.model';
import { UserType } from './user.type';

// export function generateUser(user: UserWithoutMethods): UserType {
//   return {
//     _id: user.id,
//     username: user.username,
//     email: user.email,
//     role: user.role,
//     profilePicture: user.profilePicture,
//     bio: user.bio,
//     profession: user.profession,
//   };
// }

export function generateUserResponse(user: UserDocument): UserType {
  return {
    _id: user._id,
    username: user.username,
    email: user.email,
    role: user.role,
    profilePicture: user.profilePicture,
    bio: user.bio,
    profession: user.profession,
  };
}
