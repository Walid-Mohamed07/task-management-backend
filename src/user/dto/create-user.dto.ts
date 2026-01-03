import { IsEmail, IsString, Length, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the user',
    example: 'john_doe',
  })
  @IsString()
  @Length(3, 20)
  readonly name: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'example@example.com',
  })
  @IsEmail()
  readonly email: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
    required: false,
  })
  @IsOptional()
  @IsString()
  @Length(7, 20)
  readonly phone?: string;

  @ApiProperty({
    description: 'The role of the user',
    example: 'admin',
  })
  @IsString()
  readonly role: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password123',
  })
  @IsString()
  @Length(3, 30)
  readonly password: string;

  @ApiProperty({
    description: 'The profile picture of the user',
    example: 'profile.jpg',
  })
  profilePicture: Express.Multer.File;
}
