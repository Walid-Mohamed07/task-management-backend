import { PartialType } from '@nestjs/swagger';
import { CreateUserTasksDto } from './create-user-tasks.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserTaskStatus } from 'src/common/enums/status.enum';
import { UserTaskProgress } from 'src/common/enums/progress';

export class UpdateUserTasksDto extends PartialType(CreateUserTasksDto) {
  @ApiPropertyOptional({ example: 'Started working on the task' })
  @IsString()
  @IsOptional()
  comment?: string;

  @ApiPropertyOptional({ enum: UserTaskStatus })
  @IsEnum(UserTaskStatus)
  @IsOptional()
  status?: UserTaskStatus;

  @ApiPropertyOptional({ enum: UserTaskProgress })
  @IsEnum(UserTaskProgress)
  @IsOptional()
  progress?: UserTaskProgress;
}
