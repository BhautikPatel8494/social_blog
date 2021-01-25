import { Module } from '@nestjs/common';
import { GiftRecommendationController } from './giftRecommendation.controller';

@Module({
  controllers: [GiftRecommendationController],
  providers: [],
})
export class GiftRecommendationModule {}
