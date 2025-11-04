import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { TaskStatus } from 'src/common/enums/status.enum';

@Schema({ timestamps: true })
export class UserTask {
  @ApiProperty({ example: '60f1b5f1d6c4c0a7f0a5e8e1' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: Types.ObjectId;

  @ApiProperty({ example: '60f1b5f1d6c4c0a7f0a5e8e1' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Task', required: true })
  taskId: Types.ObjectId;

  @ApiProperty({ example: '60f1b5f1d6c4c0a7f0a5e8e1' })
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: false,
  })
  projectId: Types.ObjectId;

  @ApiProperty({ example: 'Fix report num.4' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ example: 'Resolve 401 issue on Big Cairo project' })
  @Prop()
  description?: string;

  @ApiProperty({ example: 'Done updating UI' })
  @Prop({ type: String })
  comment?: string;

  @ApiProperty({ enum: TaskStatus, default: TaskStatus.PENDING })
  @Prop({ enum: TaskStatus, default: TaskStatus.PENDING })
  status: TaskStatus;

  @ApiProperty({ example: '2025-10-30T12:00:00Z' })
  @Prop({ type: Date })
  startDate?: Date;

  @ApiProperty({ example: '2025-10-31T12:00:00Z' })
  @Prop({ type: Date })
  endDate?: Date;

  @ApiProperty({ example: '2025-10-31T14:00:00Z' })
  @Prop({ type: Date })
  lastUpdate?: Date;

  @ApiProperty({
    description: 'Task dead time',
    example: '2025-10-31T14:00:00Z',
  })
  @Prop({ type: Date })
  deadTime?: Date;

  @ApiProperty({
    example: 3600,
    description: 'Total time spent in hours and minutes',
  })
  @Prop({ type: Number, default: 0 })
  cumulativeTime: number;

  @ApiProperty({ type: String, description: 'Admin who assigned the task' })
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  assignedBy: Types.ObjectId;
}

export const UserTaskSchema = SchemaFactory.createForClass(UserTask);
