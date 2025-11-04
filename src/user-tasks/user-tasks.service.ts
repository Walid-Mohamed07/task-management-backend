import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTask } from './schemas/user-task.schema';
import { CreateUserTasksDto } from './dto/create-user-tasks.dto';
import { UpdateUserTasksDto } from './dto/update-user-tasks.dto';

@Injectable()
export class UserTasksService {
  constructor(
    @InjectModel(UserTask.name) private userTaskModel: Model<UserTask>,
  ) {}

  async findAll() {
    return this.userTaskModel
      .find()
      .populate('userId taskId assignedBy', {
        _id: 1,
        title: 1,
        description: 1,
        name: 1,
        profilePicture: 1,
      })
      .exec();
  }

  async findByUser(userId: string) {
    return this.userTaskModel
      .find({ userId })
      .populate('taskId userId assignedBy', {
        _id: 0,
        title: 1,
        description: 1,
        name: 1,
        profilePicture: 1,
      })
      .exec();
  }

  async findByTask(taskId: string) {
    return this.userTaskModel
      .find({ taskId })
      .populate('taskId userId assignedBy', {
        _id: 0,
        title: 1,
        description: 1,
        name: 1,
        profilePicture: 1,
      })
      .exec();
  }

  async create(createUserTaskDto: CreateUserTasksDto, user: string) {
    const task = {
      ...createUserTaskDto,
      assignedBy: user,
    };
    await this.userTaskModel.create(task);

    return task;
  }

  async update(id: string, dto: UpdateUserTasksDto) {
    return this.userTaskModel.findByIdAndUpdate(id, dto, { new: true }).exec();
  }

  async remove(id: string) {
    return this.userTaskModel.findByIdAndDelete(id);
  }
}
