import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Res, UnauthorizedException } from '@nestjs/common';
import { CreateUserDocument, User, UserDocument } from './user.model';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { EditProfileInput } from './dto/edit-profile.input';
import {UserRepository} from "./user.repository";
import {JwtService} from "@nestjs/jwt";
import {Response} from "express";
import bcrypt from "bcrypt";
import {ConfigService} from "@nestjs/config";
import {UserType} from "./user.type";
import {generateUserResponse} from "./user.util";
import {Role} from "./role.enum";
import {UpdateUserRoleInput} from "./dto/update-user-role.input";
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
  
  async register(createUserInput: CreateUserInput): Promise<{message: string}> {
    try {
      await this.userRepository.create(createUserInput);
      return {message: "user registered successfully"};
    } catch (error) {
      throw new InternalServerErrorException("Error creating user");
    }
  }

  async login({email, password}: LoginUserInput, response: Response): Promise<{message: string, token: string, user: UserType}> {
    try {
      const user = await this.userRepository.findOne({email});
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        throw new UnauthorizedException("Password not match");
      }
      const token = this.jwtService.sign({id: user._id, role: user.role});
      // set cookie
      response.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production', // Only use secure in production
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
        maxAge: 3600000, // 1 hour
      });
      const userResponse = generateUserResponse(user);
      return {message: "Logged in successfully", token, user: userResponse};
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error logging in");
    }
  }

  // logout
  async logout(response: Response): Promise<{message: string}> {
    response.clearCookie('token');
    return {message: "Logged out successfully"};
  }

  // delete user
  async deleteUser(id: string): Promise<{message: string}> {
    try {
      const user = await this.userRepository.findByIdAndDelete(id);
      if (!user) {
        throw new NotFoundException("User not found");
      }
      return {message: "User deleted successfully"};
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error deleting user");
    }
  }
  
  // get all users
  async findAll(): Promise<User[]> {
    try {
      const users = await this.userRepository.find({}, "id email role", {sort: {createdAt: -1}});
      return users;
    } catch (error) {
      throw new InternalServerErrorException("Error getting users");
    }
  }
  
  // update user role
  async updateUserRole({userId, role}: UpdateUserRoleInput): Promise<{message: string, user: UserType}> {
    try {
      const user = await this.userRepository.findByIdAndUpdate(userId, {role});
      if (!user) {
        throw new NotFoundException("User not found"); // 404
      }
      return {message: "User role updated successfully", user: generateUserResponse(user)};
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error updating user role");
    }
  }

  // edit or update profile
  async editProfile(editProfileInput: EditProfileInput) {
    try {
      const {userId, username, profilePicture, bio, profession} = editProfileInput;
      if (!userId) {
        throw new BadRequestException("User ID is required"); // 400
      }
      const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found"); // 404
      }
      if (username !== undefined) user.username = username;
      if (profilePicture !== undefined) user.profilePicture = profilePicture;
      if (bio !== undefined) user.bio = bio;
      if (profession !== undefined) user.profession = profession;
      console.log(user)
      await this.userRepository.findByIdAndUpdate(userId, user);
      // user.save is not a function here
      // await user.save();
      return {message: "Profile updated successfully", user:generateUserResponse(user)};
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error editing profile");
    }
  }

  // toEntity(userDocument: UserDocument): User {
  //   const user = userDocument;
  //   delete user.password;
  //   return user;
  // }
}
