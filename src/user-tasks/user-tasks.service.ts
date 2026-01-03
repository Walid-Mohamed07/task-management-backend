import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { UserTask } from './schemas/user-task.schema';
import { CreateUserTasksDto } from './dto/create-user-tasks.dto';
import { UpdateUserTasksDto } from './dto/update-user-tasks.dto';
import { NotificationsService } from 'src/notifications/notifications.service';

@Injectable()
export class UserTasksService {
  constructor(
    @InjectModel(UserTask.name) private userTaskModel: Model<UserTask>,
    private notificationsService: NotificationsService,
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
        priority: 1,
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
        priority: 1,
        profilePicture: 1,
      })
      .exec();
  }

  async create(
    createUserTaskDto: CreateUserTasksDto,
    user: string,
    userName: string,
  ) {
    const task = {
      ...createUserTaskDto,
      assignedBy: user,
    };
    const created = await this.userTaskModel.create(task);

    // Push a notification to the assigned user and attempt external delivery
    try {
      await this.notificationsService.createNotification(
        createUserTaskDto.userId,
        'Task assigned',
        `You were assigned to task "${createUserTaskDto.title}" by ${userName}`,
        'info',
        {
          taskId: createUserTaskDto.taskId,
          projectId: createUserTaskDto.projectId,
        },
      );
    } catch (err) {
      console.log(err);
    }

    return created;
  }

  async update(id: string, dto: UpdateUserTasksDto) {
    const updated = await this.userTaskModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();

    if (updated) {
      try {
        // notify the assigned user about the update
        const uid = (updated as any).userId?.toString();
        const title = 'Task updated';
        const message = `Task "${(updated as any).title || ''}" status was updated.`;
        const messageType =
          (updated as any).status === 'completed' ? 'success' : 'info';
        if (uid) {
          await this.notificationsService.createNotification(
            uid,
            title,
            message,
            messageType,
            { taskId: (updated as any).taskId },
          );
        }
      } catch (err) {
        // ignore notification errors
      }
    }

    return updated;
  }

  async remove(id: string) {
    return this.userTaskModel.findByIdAndDelete(id);
  }
}
