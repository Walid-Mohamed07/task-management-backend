import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';

export class UpdateNotificationDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  read?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  messageType?: 'info' | 'warning' | 'error' | 'success';

  @ApiProperty({ required: false })
  @IsOptional()
  meta?: Record<string, any>;
}
