import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = new DocumentBuilder()
    .setTitle('Task-management API')
    .setDescription('API docs for your backend')
    .setVersion('1.0')
    .addBearerAuth() // optional: JWT support
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  // app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);

  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT ?? 3000}`,
  );
  console.log(
    `📘 Swagger docs: http://localhost:${process.env.PORT ?? 3000}/api/docs`,
  );
}
bootstrap();
