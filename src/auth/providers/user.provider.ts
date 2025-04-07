import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

import { User } from '../schemas/user.schema';
import { IUser } from '../interfaces/user.interface';

@Injectable()
export class UserProvider {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async create(name: string, email: string, password: string): Promise<User> {
    return await this.userModel.create({ name, email, password });
  }

  async getByEmail(email: string): Promise<User | null> {
    return await this.userModel.findOne({ email });
  }

  userResponse(user: User, authToken?: string, refreshToken?: string): IUser {
    return {
      id: user._id as Types.ObjectId,
      name: user.name,
      email: user.email,
      authToken,
      refreshToken,
    };
  }
}
