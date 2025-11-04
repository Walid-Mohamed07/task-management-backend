import { Injectable, NotFoundException } from '@nestjs/common';
import { Role } from './schema/role.schema';
import { UpdateRoleDto } from './dto/update-role.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class RoleService {
  constructor(
    @InjectModel(Role.name) private readonly roleModel: Model<Role>,
  ) {}

  findAll() {
    return this.roleModel.find().exec();
  }

  async findById(id: string) {
    const role = await this.roleModel.findOne({ _id: id }).exec();
    if (!role) {
      throw new NotFoundException(`Role #${id} not found!`);
    }
    return role;
  }

  create(createRoleDto: CreateRoleDto) {
    const newRole = new this.roleModel(createRoleDto);
    return newRole.save();
  }

  async update(id: string, updateRoleDto: UpdateRoleDto) {
    const existingRole = await this.roleModel
      .findByIdAndUpdate({ _id: id }, { $set: updateRoleDto }, { new: true })
      .exec();

    if (!existingRole) {
      throw new NotFoundException(`Role #${id} not found!`);
    }
    return existingRole;
  }

  async delete(id: string) {
    const res = await this.roleModel.findByIdAndDelete(id);
    if (res == null) {
      throw new NotFoundException(`Role #${id} not found!`);
    }
    return res;
  }
}
