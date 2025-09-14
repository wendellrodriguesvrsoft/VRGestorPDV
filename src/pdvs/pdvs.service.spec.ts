import { Test, TestingModule } from '@nestjs/testing';
import { PdvsService } from './pdvs.service';

describe('PdvsService', () => {
  let service: PdvsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PdvsService],
    }).compile();

    service = module.get<PdvsService>(PdvsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
