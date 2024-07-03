import CardInnerWrapper from '@/components/CardInnerWrapper'
import { CardHeader, Divider, CardBody, divider } from '@nextui-org/react'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/actions/messageActions'
import MessageBox from './MessageBox'
import { getAuthUserId } from '@/actions/authActions'
import { createChatId } from '@/libs/util'
import MessageList from './MessageList'

export default async function ChatPage({params}:{params:{userId:string}}) {
  const userId = await getAuthUserId();
  const messages = await getMessageThread(params.userId);
  const chatId = createChatId(userId, params.userId);

  return (
    <CardInnerWrapper 
      header='Chat'
      body={
        <MessageList 
          initialMessages={messages}
          userId={userId}
          chatId={chatId}
        />
      }
      footer={<ChatForm/>}
    />
  )
}
