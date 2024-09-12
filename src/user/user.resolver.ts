import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { EditProfileInput } from './dto/edit-profile.input';
import {Injectable, InternalServerErrorException, Res} from "@nestjs/common";
import {Response} from "express";
import {LoginResponse} from "./dto/login.response";
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Mutation(() => User)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.register(createUserInput);
  }
  
  @Mutation(() => LoginResponse)
  async login(@Args('loginUserInput') loginUserInput: LoginUserInput, @Context("res") res: Response) {
    return this.userService.login(loginUserInput, res);
  }
  
  @Mutation(() => User)
  async editProfile(@Args('editProfileInput') editProfileInput: EditProfileInput) {
    return this.userService.editProfile(editProfileInput);
  }
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }
}