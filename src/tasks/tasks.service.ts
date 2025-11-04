import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from './schemas/task.schema';
import { UserTask } from '../user-tasks/schemas/user-task.schema';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from 'src/common/enums/status.enum';

@Injectable()
export class TaskService {
  constructor(
    @InjectModel(Task.name) private taskModel: Model<Task>,
    @InjectModel(UserTask.name) private userTaskModel: Model<UserTask>,
  ) {}

  async create(createTaskDto: CreateTaskDto, user: string) {
    const { assignedTo, ...taskData } = createTaskDto;

    console.log(user);

    const task = await this.taskModel.create({
      ...taskData,
      createdBy: user,
      assignedTo,
      status: TaskStatus.PENDING,
    });

    // Create user tasks for each assigned employee
    const userTasks = assignedTo.map((userId) => ({
      userId,
      taskId: task._id,
      status: TaskStatus.PENDING,
      assignedBy: user,
    }));
    await this.userTaskModel.insertMany(userTasks);

    return task;
  }

  async findAll() {
    // This is less efficient than a simple .populate()
    return (
      this.taskModel
        .find()
        .populate('createdBy', { _id: 0, name: 1, profilePicture: 1 })
        // .populate('assignedTo', [{ name: 1, profilePicture: 1 }])
        .exec()
    );
  }

  async findOne(id: string) {
    const task = await this.taskModel
      .findById(id)
      .populate('createdBy', { _id: 0, name: 1, profilePicture: 1 });
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto) {
    const task = await this.taskModel.findByIdAndUpdate(id, updateTaskDto, {
      new: true,
    });

    console.log('id:', id, 'Update DTO:', updateTaskDto);
    console.log('Updated Task:', task);

    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async remove(id: string) {
    const deleted = await this.taskModel.findByIdAndDelete(id);
    if (!deleted) throw new NotFoundException('Task not found');
    await this.userTaskModel.deleteMany({ taskId: id });
    return { message: 'Task and related user tasks deleted successfully' };
  }
}
