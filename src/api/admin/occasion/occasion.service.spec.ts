import { Test, TestingModule } from '@nestjs/testing';
import { OccasionService } from './occasion.service';

describe('OccasionService', () => {
  let service: OccasionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OccasionService],
    }).compile();

    service = module.get<OccasionService>(OccasionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
