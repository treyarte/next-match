'use server';

import { MessageSchema, messageSchema } from "@/app/schemas/messageSchema";
import { ActionResults, MessageDto } from "@/types";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/libs/prisma";
import { mapMessageToMessageDto } from "@/libs/mappings";
import { pusherServer } from "@/libs/pusher";
import { createChatId } from "@/libs/util";

export async function createMessage(recipientId:string, data:MessageSchema) : Promise<ActionResults<MessageDto>> {
  try {
    const userId = await getAuthUserId();

    const validated = messageSchema.safeParse(data);

    if(!validated.success) {
      return {status: 'error', error: validated.error.errors};
    }

    const {text} = validated.data;

    const message = await prisma.message.create({
      data: {
        recipientId,
        text,
        senderId:userId
      },
      select:messageSelect
    });

    const messageDto = mapMessageToMessageDto(message);

    await pusherServer.trigger(createChatId(userId, recipientId), 'message:new', messageDto);
    await pusherServer.trigger(`private-${recipientId}`, 'message:new', messageDto);

    return {status: 'success', data:messageDto};

  } catch (error) {
    console.error(error);
    return {status: 'error', error: 'Something went wrong'};
  }
}

export async function getMessageThread(recipientId:string) {
  try {
    const userId = await getAuthUserId();
    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId:userId,
            recipientId,
            senderDeleted:false
          },
          {
            senderId: recipientId,
            recipientId:userId,
            recipientDeleted:false
          }
        ]
      },
      orderBy: {
        created: 'asc'
      },
      select:messageSelect
    });

    let readCount = 0;

    if(messages.length > 0) {
      const readMessagesIds = messages
            .filter( m => m.dateRead === null 
              && m.recipient?.userId === userId
              && m.sender?.userId === recipientId)
              .map(m => m.id);

      await prisma.message.updateMany({
        where: {
          id: {in: readMessagesIds}
        },
        data: {dateRead: new Date()}
      })
      
      readCount = readMessagesIds.length;

      await pusherServer.trigger(createChatId(recipientId, userId), 'messages:read', readMessagesIds)
    }

    const messagesToReturn  = messages.map(message => mapMessageToMessageDto(message));

    return {messages:messagesToReturn, readCount};

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMessagesByContainer(container:string) {
  try {
    const userId = await getAuthUserId();

    const conditions = {
      [container === 'outbox' ? 'senderId' : 'recipientId'] : userId,
      ...(container === 'outbox' ? {senderDeleted: false} : {recipientDeleted: false})
    }

    const messages = await prisma.message.findMany({
      where: conditions,
      orderBy: {
        created: 'desc'
      },
      select: messageSelect
    });

    return messages.map(message => mapMessageToMessageDto(message));

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUnreadMessageCount() {
  try {
    const userId = await getAuthUserId();

    return prisma.message.count({
      where: {
        recipientId: userId,
        dateRead: null,
        recipientDeleted: false
      }
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deleteMessage(messageId:string, isOutbox:boolean) {
  const selector = isOutbox ? 'senderDeleted' : 'recipientDeleted';

  try {
    const userId = await getAuthUserId();
    
    await prisma.message.update({
      where: {id: messageId},
      data: {
        [selector]:true
      }
    });

    const messagesToDelete = await prisma.message.findMany({
      where: {
        OR: [
          {
            senderId: userId,
            senderDeleted: true,
            recipientDeleted: true            
          },
          {
            recipientId: userId,
            senderDeleted: true,
            recipientDeleted: true            
          }
        ]
      }
    });

    if(messagesToDelete.length > 0) {
      await prisma.message.deleteMany({
        where: {
          OR: messagesToDelete.map(m => ({id: m.id}))
        }
      })
    }



  } catch (error) {
    console.error(error);
    throw error;
  }
}

const messageSelect = {
  id:true,
  text:true,
  created:true,
  dateRead:true,
  sender: {
    select: {
      userId:true,
      name:true,
      image:true
    }
  },
  recipient: {
    select: {
      userId:true,
      name:true,
      image:true
    }
  }
}