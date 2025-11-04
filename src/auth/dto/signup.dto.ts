import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'User username',
    example: 'exampleUser',
  })
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @ApiProperty({
    description: 'User email',
    example: 'example@example.com',
  })
  @IsNotEmpty()
  @IsEmail({}, { message: 'Please enter correct email' })
  readonly email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  readonly password: string;

  @ApiProperty({
    description: 'User role ["admin", "employee"]',
    example: 'employee',
  })
  @IsOptional()
  @IsString()
  readonly role: string;

  @ApiProperty({
    description: 'User profile picture',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  profilePicture: Express.Multer.File;
}
