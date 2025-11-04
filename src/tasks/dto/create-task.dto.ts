import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  ArrayNotEmpty,
} from 'class-validator';
import { TaskPriority } from 'src/common/enums/priority.enum';

export class CreateTaskDto {
  @ApiProperty({ example: 'Implement new feature' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'Add dark mode toggle' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @IsEnum(TaskPriority)
  @IsOptional()
  priority?: TaskPriority;

  @ApiProperty({ example: "Set Task's dead time" })
  @IsString()
  @IsOptional()
  deadTime?: string;

  @ApiProperty({
    type: [String],
    example: ['652a0b32f1e4e3c8a9f9f8c1', '652a0b32f1e4e3c8a9f9f8c2'],
  })
  @IsArray()
  @ArrayNotEmpty()
  @IsString({ each: true })
  assignedTo: string[];
}
