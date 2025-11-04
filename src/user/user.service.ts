import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import mongoose, { Model } from 'mongoose';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  storeUserImage(image: Express.Multer.File): string {
    let filename = '';
    const imageStoragePath =
      'D:/NEST JS/task-management/task-management-backend/lib/media/images/profilePicture';

    // Create the directory if it doesn't exist
    const uploadDir = path.join(imageStoragePath);
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    // Generate a unique filename and save the file
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    filename = `${uuidv4()}-${image.originalname}`;
    const filepath = path.join(uploadDir, filename);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    fs.writeFileSync(filepath, image.buffer);

    return `${imageStoragePath}${filename}`;
  }

  async create(
    profilePicture: Express.Multer.File,
    createUserDto: CreateUserDto,
  ) {
    console.log(profilePicture);
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const newUser = new this.userModel({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      role: createUserDto.role
        ? createUserDto.role
        : '690348da70e20632aa76c174', // Default role ID for 'employee'
      profilePicture: profilePicture
        ? this.storeUserImage(profilePicture)
        : 'unknown.webp',
    });
    return newUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('role', { _id: 0, name: 1 });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userModel
      .findById(id)
      .populate('role', { _id: 0, name: 1 });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  findUserByEmail({ email }) {
    return this.userModel
      .findOne({ email })
      .populate('role', { _id: 0, name: 1 })
      .exec();
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
    profilePicture: Express.Multer.File,
  ) {
    const isValid = mongoose.Types.ObjectId.isValid(id);

    if (!isValid) throw new NotFoundException(`Invalid ID!`);
    const hashedPassword = updateUserDto.password
      ? await bcrypt.hash(updateUserDto.password, 10)
      : undefined;
    const existingUser = await this.userModel
      .findByIdAndUpdate(
        { _id: id },
        {
          $set: {
            username: updateUserDto.name,
            email: updateUserDto.email,
            password: hashedPassword,
            role: updateUserDto.role,
            profilePicture: profilePicture
              ? this.storeUserImage(profilePicture)
              : 'unknown.webp',
          },
        },
        { new: true },
      )
      .exec();

    if (!existingUser) {
      throw new NotFoundException(`User #${id} not found!`);
    }
    return existingUser;

    // const index = this.users.findIndex((user) => user.id == id);
    // this.users[index] = {
    //   ...this.users[index],
    //   ...updateUserDto,
    // };

    // return this.users[index];
  }

  async remove(id: string) {
    const deleted = await this.userModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('User not found');
    return { message: 'User deleted successfully' };
  }
}
