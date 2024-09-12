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
@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository, private readonly jwtService: JwtService, private readonly configService: ConfigService) {}
  
  async register(createUserInput: CreateUserInput): Promise<User> {
    try {
      return this.toEntity(
        await this.userRepository.create(createUserInput),
      );
    } catch (error) {
      throw new InternalServerErrorException("Error creating user");
    }
  }

  async login({email, password}: LoginUserInput, response: Response): Promise<{message: string, token: string, user: User}> {

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
      const userResponse = this.toEntity(user);
      return {message: "Logged in successfully", token, user: userResponse};
    
  }

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
      // await this.userRepository.update(userId, user);
      await user.save();
      return this.toEntity(user);
    } catch (error) {
      if (!(error instanceof InternalServerErrorException)) {
        throw error;
      }
      throw new InternalServerErrorException("Error editing profile");
    }
  }

  async findAll(): Promise<User[]> {
    return await this.userRepository.find({}, "id email role", {sort: {createdAt: -1}});
  }


  toEntity(userDocument: UserDocument): User {
    const user = userDocument;
    delete user.password;
    return user;
  }
}