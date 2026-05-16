import { Body, Controller, DefaultValuePipe, Get, ParseIntPipe, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiProperty, ApiTags } from '@nestjs/swagger';
import { ChatChannel, ChatMessage } from '@prisma/client';
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { ChatService } from './chat.service';

class SendMessageDto {
  @ApiProperty()
  @IsString()
  senderId!: string;

  @ApiProperty({ enum: ChatChannel })
  @IsEnum(ChatChannel)
  channel!: ChatChannel;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  target?: string;

  @ApiProperty({ minLength: 1, maxLength: 500 })
  @IsString()
  @MinLength(1)
  @MaxLength(500)
  body!: string;
}

@ApiTags('chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chat: ChatService) {}

  @Post('messages')
  @ApiOperation({ summary: 'Send a chat message on a channel. Persisted for moderation.' })
  send(@Body() dto: SendMessageDto): Promise<ChatMessage> {
    return this.chat.send(dto);
  }

  @Get('messages')
  @ApiOperation({ summary: 'List recent messages on a channel (newest first).' })
  recent(
    @Query('channel') channel: ChatChannel,
    @Query('target') target: string | undefined,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
  ): Promise<ChatMessage[]> {
    return this.chat.recent(channel, target, limit);
  }
}
