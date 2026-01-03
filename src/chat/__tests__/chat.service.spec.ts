import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChatService } from '../chat.service';

describe('ChatService', () => {
  let service: ChatService;
  const mockConvModel = {
    findById: jest.fn(),
    find: jest.f(),
  };
  const mockMsgModel = function () {} as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        { provide: getModelToken('Conversation'), useValue: mockConvModel },
        { provide: getModelToken('Message'), useValue: mockMsgModel },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
