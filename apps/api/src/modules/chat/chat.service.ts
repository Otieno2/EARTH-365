import { BadRequestException, Injectable } from '@nestjs/common';
import { ChatChannel, ChatMessage } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const MAX_MESSAGE_LEN = 500;

@Injectable()
export class ChatService {
  constructor(private readonly prisma: PrismaService) {}

  async send(params: {
    senderId: string;
    channel: ChatChannel;
    target?: string;
    body: string;
  }): Promise<ChatMessage> {
    if (!params.body || params.body.length > MAX_MESSAGE_LEN) {
      throw new BadRequestException(`Message must be 1-${MAX_MESSAGE_LEN} characters`);
    }
    // Phase 1: persist for moderation review. Realtime delivery via Redis
    // pub/sub will be added in the same module in a follow-up PR.
    return this.prisma.chatMessage.create({
      data: {
        senderId: params.senderId,
        channel: params.channel,
        target: params.target,
        body: params.body,
      },
    });
  }

  recent(channel: ChatChannel, target?: string, limit = 50): Promise<ChatMessage[]> {
    return this.prisma.chatMessage.findMany({
      where: { channel, ...(target ? { target } : {}) },
      orderBy: { createdAt: 'desc' },
      take: Math.min(limit, 200),
    });
  }
}
