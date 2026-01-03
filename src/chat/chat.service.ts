import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Conversation,
  ConversationDocument,
} from './schemas/conversation.schema';
import { Message, MessageDocument } from './schemas/message.schema';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Conversation.name)
    private convModel: Model<ConversationDocument>,
    @InjectModel(Message.name) private msgModel: Model<MessageDocument>,
    private userService: UserService,
  ) {}

  async createConversation(dto: CreateConversationDto, creatorId?: string) {
    const participants = [...dto.participants];
    if (creatorId && !participants.includes(creatorId)) {
      participants.push(creatorId);
    }

    const name = dto.name;
    const isGroup = participants.length > 2;
    const avatar = dto.avatar
      ? dto.avatar
      : isGroup
        ? 'group.png'
        : 'unknown.webp';

    if (!isGroup) {
      const otherUserId = participants.find((p) => p !== creatorId);
      const user = await this.userService.findOne(otherUserId);
      const existingConversation = await this.convModel.findOne({
        isGroup: false,
        participants: {
          $all: [
            new Types.ObjectId(creatorId),
            new Types.ObjectId(otherUserId),
          ],
        },
      });

      if (existingConversation) {
        throw new NotFoundException(
          'Conversation with this user already exists',
        );
      }

      if (!user) {
        throw new NotFoundException('User not found');
      }
    }

    const conv = new this.convModel({
      participants: participants.map((p) => new Types.ObjectId(p)),
      name: isGroup ? name : undefined,
      avatar: isGroup ? avatar : undefined,
      isGroup,
      createdBy: creatorId ? new Types.ObjectId(creatorId) : undefined,
    });
    return conv.save();
  }

  async getConversation(id: string) {
    const conv = await this.convModel
      .findById(id)
      .populate('participants', {
        _id: 1,
        name: 1,
        email: 1,
        profilePicture: 1,
      })
      .populate('latestMessage')
      .exec();
    if (!conv) throw new NotFoundException('Conversation not found');
    return conv;
  }

  async listForUser(userId: string) {
    return this.convModel
      .find({ participants: userId })
      .populate('participants', {
        _id: 1,
        name: 1,
        email: 1,
        profilePicture: 1,
      })
      .populate('latestMessage')
      .exec();
  }

  async sendMessage(dto: CreateMessageDto, senderId: string) {
    // Ensure conversation exists and sender is a participant
    const conv = await this.convModel.findById(dto.conversationId).exec();
    if (!conv) throw new NotFoundException('Conversation not found');

    const isParticipant = conv.participants.some(
      (p: any) => p.toString() === senderId,
    );
    if (!isParticipant)
      throw new NotFoundException('Sender is not a participant');
    const msg = new this.msgModel({
      conversationId: new Types.ObjectId(dto.conversationId),
      senderId: new Types.ObjectId(senderId),
      content: dto.content,
      replyTo: dto.replyTo ? new Types.ObjectId(dto.replyTo) : undefined,
      meta: dto.meta || {},
    });
    const saved = await msg.save();

    await this.convModel.findByIdAndUpdate(dto.conversationId, {
      latestMessage: saved.id,
    });

    return saved;
  }

  async getMessages(conversationId: string, limit = 50, page = 1) {
    const pageSize = limit;
    const skip = (page - 1) * pageSize;
    return this.msgModel
      .find({ conversationId })
      .populate('senderId readBy', {
        _id: 1,
        name: 1,
        email: 1,
        profilePicture: 1,
      })
      .populate({
        path: 'replyTo',
        select: 'content senderId',
        populate: { path: 'senderId', select: '_id name email profilePicture' },
      })
      .populate('reactions.userId', {
        _id: 1,
        name: 1,
        email: 1,
        profilePicture: 1,
      })
      .sort({ createdAt: 1 })
      .skip(skip)
      .limit(pageSize)
      .exec();
  }

  async reactToMessage(
    messageId: string,
    userId: string,
    emoji: string,
    action?: 'add' | 'remove',
  ) {
    const msg = await this.msgModel.findById(messageId).exec();
    if (!msg) throw new NotFoundException('Message not found');

    // Ensure the user is a participant of the conversation
    const conv = await this.convModel.findById(msg.conversationId).exec();
    if (!conv) throw new NotFoundException('Conversation not found');

    const isParticipant = conv.participants.some(
      (p: any) => p.toString() === userId,
    );
    if (!isParticipant)
      throw new NotFoundException('User is not a participant');

    const userObjId = new Types.ObjectId(userId);
    msg.reactions = msg.reactions || [];
    const existingIndex = msg.reactions.findIndex(
      (r: any) => r.emoji === emoji && r.userId.toString() === userId,
    );

    if (action === 'add') {
      if (existingIndex === -1)
        msg.reactions.push({ emoji, userId: userObjId });
    } else if (action === 'remove') {
      if (existingIndex !== -1) msg.reactions.splice(existingIndex, 1);
    } else {
      // toggle
      if (existingIndex !== -1) msg.reactions.splice(existingIndex, 1);
      else msg.reactions.push({ emoji, userId: userObjId });
    }

    await msg.save();
    return this.msgModel
      .findById(messageId)
      .populate('senderId readBy', {
        _id: 1,
        name: 1,
        email: 1,
        profilePicture: 1,
      })
      .populate('reactions.userId', {
        _id: 1,
        name: 1,
        email: 1,
        profilePicture: 1,
      })
      .exec();
  }

  async markConversationMessagesAsRead(conversationId: string, userId: string) {
    // add userId to readBy array for all messages in the conversation where it's not present
    const res = await this.msgModel.updateMany(
      {
        conversationId: new Types.ObjectId(conversationId),
        readBy: { $ne: new Types.ObjectId(userId) },
      },
      { $addToSet: { readBy: new Types.ObjectId(userId) } },
    );

    return res;
  }

  async getUnreadCount(conversationId: string, userId: string) {
    return this.msgModel
      .countDocuments({
        conversationId,
        senderId: { $ne: new Types.ObjectId(userId) },
        readBy: { $ne: new Types.ObjectId(userId) },
      })
      .exec();
  }
}
