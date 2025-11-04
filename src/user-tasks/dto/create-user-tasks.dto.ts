import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsString,
  IsUUID,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';
import { UserTaskStatus } from 'src/common/enums/status.enum';
import { UserTaskProgress } from 'src/common/enums/progress';

export class CreateUserTasksDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  projectId: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  taskId: string;

  @ApiProperty({ example: 'a1b2c3d4-e5f6-7890-1234-56789abcdef0' })
  @IsUUID()
  userId: string;

  @ApiProperty({ example: 'Implement new feature' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Add dark mode toggle' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: UserTaskStatus, default: UserTaskStatus.ASSIGNED })
  @IsEnum(UserTaskStatus)
  @IsOptional()
  status?: UserTaskStatus = UserTaskStatus.ASSIGNED;

  @ApiProperty({ example: "Set Task's dead time" })
  @IsString()
  @IsOptional()
  deadTime?: string;

  @ApiProperty({
    enum: UserTaskProgress,
    default: UserTaskProgress.NOT_STARTED,
  })
  @IsEnum(UserTaskProgress)
  @IsOptional()
  progress?: UserTaskProgress = UserTaskProgress.NOT_STARTED;

  @ApiProperty({ example: 'Admin User' })
  @IsString()
  @IsOptional()
  assignedBy?: string;
}
