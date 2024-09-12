import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { EditProfileInput } from './dto/edit-profile.input';
import {Injectable, InternalServerErrorException, Res} from "@nestjs/common";
import {Response} from "express";
import {LoginResponse} from "./dto/login-user.response";
import {CreateUserResponse, DeleteUserResponse, LogoutResponse} from "./dto/user.message-string.reponse";
import {UpdateUserRoleInput} from "./dto/update-user-role.input";
import {UpdateUserRoleResponse} from "./dto/update-user-role.response";
import {EditProfileResponse} from "./dto/edit-profile.response";
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Mutation(() => CreateUserResponse)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    try {
      return this.userService.register(createUserInput);
    } catch (error) {
      throw error;
    }
  }
  
  @Mutation(() => LoginResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context("res") res: Response) {
    try {
      return this.userService.login(loginUserInput, res);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => LogoutResponse)
  async logout(@Context("res") res: Response) {
    try {
      return this.userService.logout(res);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => DeleteUserResponse)
  async deleteUser(@Args("id") id: string) {
    try {
      return this.userService.deleteUser(id);
    } catch (error) {
      throw error;
    }
  }

  @Query(() => [User])
  async users() {
    try {
      return this.userService.findAll();
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => UpdateUserRoleResponse)
  async updateUserRole(@Args('updateUserRoleInput') updateUserRoleInput: UpdateUserRoleInput) {
    try {
      return this.userService.updateUserRole(updateUserRoleInput);
    } catch (error) {
      throw error;
    }
  }

  @Mutation(() => EditProfileResponse)
  async editProfile(@Args('editProfileInput') editProfileInput: EditProfileInput) {
    try {
      return this.userService.editProfile(editProfileInput);
    } catch (error) {
      throw error;
    }
  }
}