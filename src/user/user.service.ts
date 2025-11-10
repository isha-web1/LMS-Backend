import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { RegisterUserDto } from 'src/auth/dto/registerUser.dto';
import { User } from './schemas/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}
  async createUser(registerUserDto: RegisterUserDto) {
    try {
      return await this.userModel.create({
        firstName: registerUserDto.firstName,
        lastName: registerUserDto.lastName,
        email: registerUserDto.email,
        password: registerUserDto.password,
      });
    } catch (err: unknown) {
      const e = err as { code?: number };
      const DUPLICATE_KEY_ERROR_CODE = 11000;
      if (e.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new ConflictException('User with this email already exists');
      }
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).select('+password').exec();
  }
}
