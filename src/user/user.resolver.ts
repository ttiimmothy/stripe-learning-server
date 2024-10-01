import { Resolver, Query, Mutation, Args, Context } from '@nestjs/graphql';
import { UserService } from './user.service';
import { User } from './user.model';
import { CreateUserInput } from './dto/create-user.input';
import { LoginUserInput } from './dto/login-user.input';
import { EditProfileInput } from './dto/edit-profile.input';
import { Response } from 'express';
import { LoginResponse } from './dto/login-user.response';
import {
  CreateUserResponse,
  DeleteUserResponse,
  LogoutResponse,
} from './dto/user.message-string.response';
import { UpdateUserRoleInput } from './dto/update-user-role.input';
import { UpdateUserRoleResponse } from './dto/update-user-role.response';
import { EditProfileResponse } from './dto/edit-profile.response';
import {UseGuards} from "@nestjs/common";
import {AuthAdminGuard} from "../auth/authAdmin.guard";
@Resolver(() => User)
export class UserResolver {
  constructor(private userService: UserService) {}
  @Mutation(() => CreateUserResponse)
  async createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.userService.register(createUserInput);
  }

  @Mutation(() => LoginResponse)
  async login(
    @Args('loginUserInput') loginUserInput: LoginUserInput,
    @Context('res') res: Response,
  ) {
    return this.userService.login(loginUserInput, res);
  }

  @Mutation(() => LogoutResponse)
  async logout(@Context('res') res: Response) {
    return this.userService.logout(res);
  }

  @Mutation(() => DeleteUserResponse)
  async deleteUser(@Args('id') id: string) {
    return this.userService.deleteUser(id);
  }

  @UseGuards(AuthAdminGuard)
  @Query(() => [User])
  async users() {
    return this.userService.findAll();
  }

  @Query(() => User)
  async user(@Args('id') id: string) {
    return this.userService.findById(id);
  }

  @Mutation(() => UpdateUserRoleResponse)
  async updateUserRole(
    @Args('updateUserRoleInput') updateUserRoleInput: UpdateUserRoleInput,
  ) {
    return this.userService.updateUserRole(updateUserRoleInput);
  }

  @Mutation(() => EditProfileResponse)
  async editProfile(
    @Args('editProfileInput') editProfileInput: EditProfileInput,
  ) {
    return this.userService.editProfile(editProfileInput);
  }
}
