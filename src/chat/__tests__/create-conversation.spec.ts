import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { ChatService } from '../chat.service';
import { UserService } from 'src/user/user.service';
import { Conversation } from '../schemas/conversation.schema';
import { Message } from '../schemas/message.schema';
import { User } from 'src/user/schemas/user.schema';
import { CreateConversationDto } from '../dto/create-conversation.dto';
import { Types } from 'mongoose';

describe('ChatService.createConversation', () => {
  let service: ChatService;
  let userService: UserService;

  const mockConvModel = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockUserModel = {
    findById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ChatService,
        UserService,
        {
          provide: getModelToken(Conversation.name),
          useValue: {
            new: jest.fn().mockImplementation((data) => ({
              ...data,
              save: jest.fn().mockResolvedValue(data),
            })),
          },
        },
        {
          provide: getModelToken(Message.name),
          useValue: {},
        },
        {
          provide: getModelToken(User.name),
          useValue: mockUserModel,
        },
      ],
    }).compile();

    service = module.get<ChatService>(ChatService);
    userService = module.get<UserService>(UserService);
  });

  it('should create a one-on-one conversation', async () => {
    const creatorId = '60f8d1e3b3f3e3e3e3e3e3e3';
    const otherUserId = '60f8d1e3b3f3e3e3e3e3e3e4';
    const user = {
      _id: otherUserId,
      name: 'John Doe',
      profilePicture: 'picture.jpg',
    };
    const dto: CreateConversationDto = {
      participants: [otherUserId],
    };

    jest.spyOn(userService, 'findOne').mockResolvedValue(user as any);

    const result = await service.createConversation(dto, creatorId);

    expect(userService.findOne).toHaveBeenCalledWith(otherUserId);
    expect(result.name).toBe(user.name);
    expect(result.avatar).toBe(user.profilePicture);
    expect(result.isGroup).toBe(false);
    expect(result.participants).toHaveLength(2);
    expect(result.participants.map(String)).toContain(creatorId);
    expect(result.participants.map(String)).toContain(otherUserId);
  });

  it('should create a group conversation', async () => {
    const creatorId = '60f8d1e3b3f3e3e3e3e3e3e3';
    const participants = [
      '60f8d1e3b3f3e3e3e3e3e3e4',
      '60f8d1e3b3f3e3e3e3e3e3e5',
    ];
    const dto: CreateConversationDto = {
      name: 'Test Group',
      avatar: 'group.jpg',
      participants: participants,
    };

    const result = await service.createConversation(dto, creatorId);

    expect(result.name).toBe(dto.name);
    expect(result.avatar).toBe(dto.avatar);
    expect(result.isGroup).toBe(true);
    expect(result.participants).toHaveLength(3);
    expect(result.participants.map(String)).toContain(creatorId);
    expect(result.participants.map(String)).toContain(participants[0]);
    expect(result.participants.map(String)).toContain(participants[1]);
  });
});
