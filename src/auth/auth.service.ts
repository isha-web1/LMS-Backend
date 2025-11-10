import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import { RegisterUserDto } from './dto/registerUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { LoginUserDto } from './dto/loginUser.dto';
import { UserDocument } from 'src/user/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(registerUserDto: RegisterUserDto) {
    // 1. Hash the password
    const saltRounds = 10;
    const hash = await bcrypt.hash(registerUserDto.password, saltRounds);

    // 2. Save the user (UserService handles conflict checking)
    const user = await this.userService.createUser({
      ...registerUserDto,
      password: hash,
    });

    // 3. Generate a JWT token
    const payload = {
      sub: user?._id, // user is guaranteed to be a UserDocument with an _id here
      email: user?.email,
      role: user?.role,
    };

    const token = await this.jwtService.signAsync(payload);

    // 4. Send token in response
    return token;
  }

  async validateUser(
    email: string,
    pass: string,
  ): Promise<UserDocument | null> {
    const user = await this.userService.findUserByEmail(email);

    if (user) {
      const isMatch = await bcrypt.compare(pass, user.password);

      if (isMatch) {
        return user as UserDocument;
      }
    }
    return null;
  }

  async loginUser(loginUserDto: LoginUserDto) {
    const user: UserDocument | null = await this.validateUser(
      loginUserDto.email,
      loginUserDto.password,
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload = {
      sub: user._id,
      email: user.email,
      role: user.role,
    };

    const token = await this.jwtService.signAsync(payload);
    return token;
  }
}
