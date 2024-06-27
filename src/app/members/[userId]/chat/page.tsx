import CardInnerWrapper from '@/components/CardInnerWrapper'
import { CardHeader, Divider, CardBody, divider } from '@nextui-org/react'
import React from 'react'
import ChatForm from './ChatForm'
import { getMessageThread } from '@/actions/messageActions'
import MessageBox from './MessageBox'
import { getAuthUserId } from '@/actions/authActions'

export default async function ChatPage({params}:{params:{userId:string}}) {
  const userId = await getAuthUserId();
  const messages = await getMessageThread(params.userId);
  
  const body = (
    <div>
      {messages.length <= 0 ? 'No messages to display': (
        <div>
          {messages.map(message => (
            <MessageBox key={message.id} message={message} currentUserId={userId}/>
          ))}
        </div>
      )}
    </div>
  )

  return (
    <CardInnerWrapper 
      header='Chat'
      body={body}
      footer={<ChatForm/>}
    />
  )
}
