import { Injectable, Logger } from '@nestjs/common';
import { AbstractRepository } from '../database/abstrct.repository';
import { User, UserDocument } from './user.model';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {CreateUserInput} from "./dto/create-user.input";
import {EditProfileInput} from "./dto/edit-profile.input";

@Injectable()
export class UserRepository extends AbstractRepository<UserDocument> {
  constructor(@InjectModel(User.name) private readonly userModel: Model<UserDocument>) {
    super(userModel);
  }

  async create(createUserInput: CreateUserInput): Promise<UserDocument> {
    const newUser = new this.userModel({...createUserInput, _id: new Types.ObjectId()});
    return newUser.save();
  }
}