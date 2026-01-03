import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { User } from '../user/schemas/user.schema';
import { UserService } from '../user/user.service';
// import { Model } from 'mongoose';
// import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Model } from 'mongoose';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { SignUpDto } from './dto/signup.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  storeUserImage(image: Express.Multer.File): string {
    let filename = '';
    const imageStoragePath =
      'D:/QARA/NestJSFundamentals/NestJSFundamentals/NestProjects/ecommerce-app/lib/media/images/profilePecture/';

    // Create the directory if it doesn't exist
    const uploadDir = path.join(imageStoragePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Generate a unique filename and save the file
    filename = `${uuidv4()}-${image.originalname}`;
    const filepath = path.join(uploadDir, filename);
    fs.writeFileSync(filepath, image.buffer);

    return `${imageStoragePath}${filepath}`;
  }

  async signUp(
    profilePicture: Express.Multer.File,
    signUpDto: SignUpDto,
  ): Promise<{ token: string }> {
    const user = await this.userService.create(profilePicture, signUpDto);
    console.log(user);
    const token = this.jwtService.sign({
      sub: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    });

    return { token };
  }

  async login(loginDto: LoginDto): Promise<any> {
    const { email, password } = loginDto;

    const loggedUser = await this.userService.findUserByEmail({ email });

    if (loggedUser && (await bcrypt.compare(password, loggedUser.password))) {
      // console.log({ loggedUser });

      const user = {
        _id: loggedUser._id,
        email: loggedUser.email,
        name: loggedUser.name,
        role: loggedUser.role,
        profilePicture: loggedUser.profilePicture,
      };
      const token = this.jwtService.sign({
        sub: loggedUser._id,
        email: loggedUser.email,
        name: loggedUser.name,
        role: loggedUser.role,
      });

      return { user, token };
    }
    throw new UnauthorizedException('Invalid email or password');
  }
}
