'use server';

import { MessageSchema, messageSchema } from "@/app/schemas/messageSchema";
import { ActionResults } from "@/types";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/libs/prisma";
import { mapMessageToMessageDto } from "@/libs/mappings";

export async function createMessage(recipientId:string, data:MessageSchema) : Promise<ActionResults<MessageSchema>> {
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
      }
    });

    return {status: 'success', data:message};

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
            recipientId
          },
          {
            senderId: recipientId,
            recipientId:userId
          }
        ]
      },
      orderBy: {
        created: 'asc'
      },
      select:{
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
    });

    return messages.map(message => mapMessageToMessageDto(message))

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getMessagesByContainer(container:string) {
  try {
    const userId = await getAuthUserId();

    const selector = container === 'outbox' ? 'senderId' : 'recipientId';

    const messages = await prisma.message.findMany({
      where: {
        [selector]: userId
      },
      orderBy: {
        created: 'desc'
      },
      select: {
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
    });

    return messages.map(message => mapMessageToMessageDto(message));

  } catch (error) {
    console.error(error);
    throw error;
  }
}