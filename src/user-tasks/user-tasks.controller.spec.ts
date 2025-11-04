import { Test, TestingModule } from '@nestjs/testing';
import { UserTasksController } from './user-tasks.controller';

describe('UserTasksController', () => {
  let controller: UserTasksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTasksController],
    }).compile();

    controller = module.get<UserTasksController>(UserTasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
