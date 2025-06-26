import { Test, TestingModule } from '@nestjs/testing';
import { HomeOwnerService } from './home-owner.service';

describe('HomeOwnerService', () => {
  let service: HomeOwnerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [HomeOwnerService],
    }).compile();

    service = module.get<HomeOwnerService>(HomeOwnerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
