import { Test, TestingModule } from '@nestjs/testing';
import { PdvsController } from './pdvs.controller';
import { PdvsService } from './pdvs.service';

describe('PdvsController', () => {
  let controller: PdvsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PdvsController],
      providers: [PdvsService],
    }).compile();

    controller = module.get<PdvsController>(PdvsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
