import { Module } from '@nestjs/common';
import { OccasionController } from './occasion.controller';

@Module({
  controllers: [OccasionController],
  providers: []
})
export class OccasionModule {}
