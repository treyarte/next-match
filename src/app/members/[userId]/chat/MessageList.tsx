'use client';

import { MessageDto } from '@/types';
import React, { useCallback, useEffect, useState } from 'react'
import MessageBox from './MessageBox';
import { pusherClient } from '@/libs/pusher';

type Props = {
    initialMessages:MessageDto[];
    userId:string;
    chatId:string;
}

export default function MessageList({initialMessages, userId, chatId}:Props) {
    const [messages, setMessages] = useState(initialMessages);

    const handleMessages = useCallback((message:MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    useEffect(() => {
        const channel = pusherClient.subscribe(chatId);
        channel.bind("message:new", handleMessages);

        return () => {
            channel.unsubscribe();
            channel.unbind("message:new", handleMessages);
        }
    }, [chatId, handleMessages]);

    return (
        <div>
            {messages.length <= 0 ? 'No messages to display': (
            <div>
                {messages.map(message => (
                    <MessageBox 
                        key={message.id} 
                        message={message} 
                        currentUserId={userId}
                    />
                ))}
            </div>
            )}
        </div>
  )
}
