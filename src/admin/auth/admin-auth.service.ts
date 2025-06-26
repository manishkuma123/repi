import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/entitites/user';
import * as bcrypt from 'bcryptjs';
import { Role } from 'src/utils/enum';

@Injectable()
export class AdminAuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(body: any) {
    const { email, password, full_name } = body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new this.userModel({
      email,
      password: hashedPassword,
      full_name,
      role: Role.Admin,
      isVerified: true,
    });
    await user.save();
    return { message: 'Admin registered successfully' };
  }

  async login(body: any) {
    const { email, password } = body;
    const user = await this.userModel.findOne({ email, role: Role.Admin });
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return null;

    const payload = { _id: user._id, email: user.email, role: user.role };
    return this.jwtService.sign(payload);
  }
}