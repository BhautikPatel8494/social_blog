import { Module } from '@nestjs/common';
import { OccasionService } from './occasion.service';
import { OccasionController } from './occasion.controller';

@Module({
  providers: [OccasionService],
  controllers: [OccasionController]
})
export class OccasionModule {}
