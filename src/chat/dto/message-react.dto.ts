import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class SetMessageReactDto {
  @ApiProperty({ description: 'Emoji to react with' })
  @IsString()
  emoji: string;

  @ApiProperty({
    description: 'Action to perform: add or remove',
  })
  @IsString({ message: 'Action must be either "add" or "remove"' })
  action: 'add' | 'remove';
}
