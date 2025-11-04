import { Module } from '@nestjs/common';
// import { APP_GUARD } from '@nestjs/core';
// import { ApiKeyGuard } from './guards/api-key/api-key.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
// import { JwtAuthGuard } from './guards/api-key/jwt-auth.guard';

const passportModule = PassportModule.register({ defaultStrategy: 'jwt' });

@Module({
  imports: [
    ConfigModule,
    passportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: configService.get<number>('JWT_EXPIRES') },
      }),
      inject: [ConfigService],
    }),
  ],
  exports: [JwtModule],
})
export class CommonModule {}
