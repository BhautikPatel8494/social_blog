import { Module } from '@nestjs/common';
import { CountryController } from './country.controller';

@Module({
  controllers: [CountryController],
  providers: []
})
export class CountryModule {}
