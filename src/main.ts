import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // app.useGlobalGuards(new LoginGuard());
  // app.useGlobalGuards(new PermissionGuard());

  // app.useGlobalPipes(new ValidationPipe());

  // app.useGlobalInterceptors(new FormatResponseInterceptor());
  // app.useGlobalInterceptors(new InvokeRecordInterceptor());

  const configService = app.get(ConfigService);
  await app.listen(configService.get('nest_server_port'));
}
bootstrap();
