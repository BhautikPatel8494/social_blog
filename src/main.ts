import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import i18n from 'i18n';
import * as fs from 'fs';
import * as Sentry from '@sentry/node';
import { AppModule } from './app.module';
import { join } from 'path';
import { AllExceptionsFilter } from './config/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new AllExceptionsFilter());
  Sentry.init({ dsn: 'https://551d6083eb7b40fca40bef22448e91c9@o508551.ingest.sentry.io/5601203', environment: 'development' });
  app.enableCors({ origin: true });
  app.set('view engine', 'ejs');
  app.use(i18n.init);
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Content-Type, Accept");
    next();
  });
  async function createFolder() {
    let dir = './upload';
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  }
  await createFolder();
  app.useStaticAssets(join(__dirname, '../upload'));
  await app.listen(process.env.PORT || 5000).then(() => {
    Logger.verbose(`Server is running on PORT ${process.env.PORT || 5000}`)
  });

}
bootstrap();
