import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { TaskService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from 'src/common/guards/api-key/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/api-key/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { Role } from 'src/common/enums/role.enum';
import { LoggedUser } from 'src/common/interfaces/logged-user.interface';

@ApiTags('Tasks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tasks')
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // ✅ Admin creates a new task
  @Post()
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Create a new task (admin only)' })
  @ApiResponse({ status: 201, description: 'Task created successfully' })
  create(@Body() dto: CreateTaskDto, @Req() req: { user: LoggedUser }) {
    return this.taskService.create(dto, req.user.sub);
  }

  // ✅ Get all tasks
  @Get()
  @ApiOperation({ summary: 'Get all tasks' })
  findAll() {
    return this.taskService.findAll();
  }

  // ✅ Get a specific task by ID
  @Get(':id')
  @ApiOperation({ summary: 'Get one task by ID' })
  findOne(@Param('id') id: string) {
    return this.taskService.findOne(id);
  }

  // ✅ Update a task (admin only)
  @Patch(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Update task (admin only)' })
  update(@Param('id') id: string, @Body() dto: UpdateTaskDto) {
    return this.taskService.update(id, dto);
  }

  // ✅ Delete a task (admin only)
  @Delete(':id')
  @Roles(Role.Admin)
  @ApiOperation({ summary: 'Delete task and related user tasks (admin only)' })
  remove(@Param('id') id: string) {
    return this.taskService.remove(id);
  }
}
