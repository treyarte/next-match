'use client';

import { MessageDto } from '@/types';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import MessageBox from './MessageBox';
import { pusherClient } from '@/libs/pusher';
import { formatShortDateTime } from '@/libs/util';
import { Channel } from 'pusher-js';

type Props = {
    initialMessages:MessageDto[];
    userId:string;
    chatId:string;
}

export default function MessageList({initialMessages, userId, chatId}:Props) {
    const [messages, setMessages] = useState(initialMessages);
    const channelRef = useRef<Channel | null>(null);
    const handleMessages = useCallback((message:MessageDto) => {
        setMessages(prevState => {
            return [...prevState, message]
        })
    }, [])

    const handleReadMessages = useCallback((messageIds:string[]) => {
        setMessages(prevState => prevState.map(message => messageIds.includes(message.id)
            ? {...message, dateRead: formatShortDateTime(new Date())} : message
        ))
    }, []);

    useEffect(() => {
        if(channelRef.current) {
            channelRef.current = pusherClient.subscribe(chatId);
            channelRef.current.bind("message:new", handleMessages);
            channelRef.current.bind("messages:read", handleReadMessages);
        }

        return () => {
            if(channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind("message:new", handleMessages);
                channelRef.current.unbind("messages:read", handleReadMessages);
            }
        }
    }, [chatId, handleMessages, handleReadMessages]);

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
