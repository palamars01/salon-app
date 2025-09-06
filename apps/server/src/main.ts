import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from '@/common/interceptors/response.interceptor';
import { ConfigService } from '@nestjs/config';
import { ConfigVars } from '@/common/interfaces';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new ResponseInterceptor());

  const configService = app.get(ConfigService<typeof ConfigVars>);

  const port = configService.get('PORT') || 5000;

  await app.listen(port);
}
bootstrap();
