import { Test, TestingModule } from '@nestjs/testing';
import { WorkTimeController } from './work-time.controller';

describe('WorkTimeController', () => {
  let controller: WorkTimeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkTimeController],
    }).compile();

    controller = module.get<WorkTimeController>(WorkTimeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
