import { Test, TestingModule } from '@nestjs/testing';
import { DramasController } from './dramas.controller';

describe('DramasController', () => {
  let controller: DramasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DramasController],
    }).compile();

    controller = module.get<DramasController>(DramasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
