import { Test, TestingModule } from '@nestjs/testing';
import { OccasionController } from './occasion.controller';

describe('OccasionController', () => {
  let controller: OccasionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [OccasionController],
    }).compile();

    controller = module.get<OccasionController>(OccasionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
