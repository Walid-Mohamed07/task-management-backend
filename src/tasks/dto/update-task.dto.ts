import { ApiProperty, PartialType } from '@nestjs/swagger';
import { IsOptional, IsString, IsIn } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  @ApiProperty({
    example: 'completed',
    enum: ['pending', 'in-progress', 'completed', 'stopped'],
    required: false,
  })
  @IsOptional()
  @IsIn(['pending', 'in-progress', 'completed', 'stopped'])
  @IsString()
  status?: string;
}
