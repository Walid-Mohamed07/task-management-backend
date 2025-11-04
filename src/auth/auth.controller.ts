import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @UseInterceptors(FileInterceptor('profilePicture'))
  signUp(
    @UploadedFile() profilePicture: Express.Multer.File,
    @Body() signUpDto: SignUpDto,
  ): Promise<{ token: string }> {
    return this.authService.signUp(profilePicture, signUpDto);
  }

  @Post('/login')
  @UseInterceptors(AnyFilesInterceptor())
  login(@Body() loginDto: LoginDto): Promise<{ token: string }> {
    return this.authService.login(loginDto);
  }
}
