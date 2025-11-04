import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Document, Types } from 'mongoose';
import { TaskStatus } from 'src/common/enums/status.enum';
import { TaskPriority } from 'src/common/enums/priority.enum';

@Schema({ timestamps: true })
export class Task extends Document {
  @ApiProperty({ example: 'Fix report num.4' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Resolve 401 issue on Big Cairo project' })
  @Prop()
  description?: string;

  @ApiProperty({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  @Prop({ enum: TaskPriority, default: TaskPriority.MEDIUM })
  priority: TaskPriority;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({
    description: 'Task dead time',
    example: '2025-10-31T14:00:00Z',
  })
  @Prop({ type: Date })
  deadTime?: Date;

  @ApiProperty({
    type: [Types.ObjectId],
    description: 'Array of user IDs assigned to this task',
  })
  @Prop({
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  })
  assignedTo: Types.ObjectId[];

  @ApiProperty({ type: String, description: 'Admin who created the task' })
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  createdBy: Types.ObjectId;

  @ApiProperty({ example: 0 })
  @Prop({ type: Number, default: 0 })
  cumulativeTime: number;
}

export const TaskSchema = SchemaFactory.createForClass(Task);
