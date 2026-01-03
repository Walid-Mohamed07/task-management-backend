import {
  Controller,
  Get,
  Param,
  Patch,
  Body,
  UseGuards,
  Post,
  Req,
  Delete,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UserTasksService } from './user-tasks.service';
import { JwtAuthGuard } from 'src/common/guards/api-key/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/api-key/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { UpdateUserTasksDto } from './dto/update-user-tasks.dto';
import { CreateUserTasksDto } from './dto/create-user-tasks.dto';
import { LoggedUser } from 'src/common/interfaces/logged-user.interface';

@ApiTags('User Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('user-tasks')
export class UserTasksController {
  constructor(private readonly userTasksService: UserTasksService) {}

  // ✅ Get all assigned tasks
  @Get()
  @ApiOperation({ summary: 'Get all assigned tasks' })
  findAll() {
    return this.userTasksService.findAll();
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all tasks assigned to a specific user' })
  findByUser(@Param('userId') userId: string) {
    return this.userTasksService.findByUser(userId);
  }

  @Get('task/:taskId')
  @ApiOperation({ summary: 'Get all users assigned to a specific task' })
  findByTask(@Param('taskId') taskId: string) {
    return this.userTasksService.findByTask(taskId);
  }

  // ✅ Admin creates a new task assignment
  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new task (admin only)' })
  @ApiResponse({
    status: 201,
    description: 'Task assignment created successfully',
  })
  create(@Body() dto: CreateUserTasksDto, @Req() req: { user: LoggedUser }) {
    return this.userTasksService.create(dto, req.user.sub, req.user.name);
  }

  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update a user-task record (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateUserTasksDto) {
    return this.userTasksService.update(id, dto);
  }

  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete a user-task record (admin only)' })
  remove(@Param('id') id: string) {
    return this.userTasksService.remove(id);
  }
}
