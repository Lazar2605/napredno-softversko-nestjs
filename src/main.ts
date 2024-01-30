import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AvailableConfigs } from './config/available-configs';
import { MongoExceptionFilter } from './exception-filters/mongo-exception-filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService)
  app.useGlobalFilters(new MongoExceptionFilter());
  app.enableCors();
  await app.listen(configService.get(AvailableConfigs.PORT));

}
bootstrap();
