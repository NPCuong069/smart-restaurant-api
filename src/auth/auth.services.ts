import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.userModel.findOne({ username }).exec();
    if (user && (await bcrypt.compare(pass, user.password))) {
      const { password, ...result } = user.toObject(); // Omit password
      return result;
    }
    return null;
  }

  async login(user: any) {
    // Include user ID in the payload
    const payload = { username: user.username, role: user.role, sub: user._id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
