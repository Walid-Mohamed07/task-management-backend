import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  Patch,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateConversationDto } from './dto/create-conversation.dto';
import { CreateMessageDto } from './dto/create-message.dto';
import { JwtAuthGuard } from 'src/common/guards/api-key/jwt-auth.guard';
import { LoggedUser } from 'src/common/interfaces/logged-user.interface';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SetMessageReactDto } from './dto/message-react.dto';

@ApiTags('Chat')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('conversations')
  createConversation(
    @Body() dto: CreateConversationDto,
    @Req() req: { user: LoggedUser },
  ) {
    const userId = req.user?.sub;

    return this.chatService.createConversation(dto, userId);
  }

  @Get('conversations/user/:userId')
  listForUser(@Param('userId') userId: string) {
    return this.chatService.listForUser(userId);
  }

  @Get('conversations/:id')
  getConversation(@Param('id') id: string) {
    return this.chatService.getConversation(id);
  }

  @Patch('conversations/:id/mark-read')
  markAsRead(@Param('id') id: string, @Req() req: { user: any }) {
    const userId = req.user?.sub;
    return this.chatService.markConversationMessagesAsRead(id, userId);
  }

  @Get('conversations/:id/unread-count')
  unreadCount(@Param('id') id: string, @Req() req: { user: any }) {
    const userId = req.user?.sub;
    return this.chatService.getUnreadCount(id, userId);
  }

  @Post('messages')
  sendMessage(@Body() dto: CreateMessageDto, @Req() req: { user: LoggedUser }) {
    const userId = req.user?.sub;
    return this.chatService.sendMessage(dto, userId);
  }

  @Patch('messages/:id/react')
  reactMessage(
    @Param('id') id: string,
    @Body() body: SetMessageReactDto,
    @Req() req: { user: any },
  ) {
    const userId = req.user?.sub;
    return this.chatService.reactToMessage(id, userId, body.emoji, body.action);
  }

  @Get('messages/:conversationId')
  getMessages(
    @Param('conversationId') conversationId: string,
    @Query('limit') limit?: string,
  ) {
    return this.chatService.getMessages(
      conversationId,
      limit ? Number(limit) : undefined,
    );
  }
}
