
import { Module, Global } from '@nestjs/common';

import { ConfigService } from './services/config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`environments/environment.${process.env.NODE_ENV}.json`),
    },
  ],
  exports: [ConfigService],
})
export class ConfigModule {
}
