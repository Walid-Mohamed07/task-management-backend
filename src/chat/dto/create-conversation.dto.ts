import { ApiProperty } from '@nestjs/swagger';
import { IsArray, ArrayMinSize, IsOptional, IsString } from 'class-validator';

export class CreateConversationDto {
  @ApiProperty({ description: 'User IDs participating in the conversation' })
  @IsArray()
  @ArrayMinSize(1)
  participants: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  avatar?: string;
}
