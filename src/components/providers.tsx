'use client'

import { getUnreadMessageCount } from '@/actions/messageActions';
import useMessageStore from '@/hooks/useMessageStore';
import { useNotificationChannel } from '@/hooks/useNotificationChannel';
import { usePresenceChannel } from '@/hooks/usePresenceChannel';
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider, getSession } from 'next-auth/react';
import React, { ReactNode, useCallback, useEffect, useRef } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({children, userId} : {children:ReactNode, userId:string|null}) {
  const isUnreadCountSet = useRef(false);
  
  const {updateUnreadCount} = useMessageStore(state => ({
    updateUnreadCount: state.updateUnreadCount
  }));

  const setUnreadCount = useCallback((amount:number) => {
    updateUnreadCount(amount);
  },[updateUnreadCount])

  useEffect(() => {
    if(!isUnreadCountSet.current && userId) {
      getUnreadMessageCount().then(count => {
        setUnreadCount(count);
      });
      isUnreadCountSet.current = true;
    }
  },[setUnreadCount, userId]);

  usePresenceChannel(userId);
  useNotificationChannel(userId);
  return (
    
    <NextUIProvider>
        <ToastContainer position='bottom-right' hideProgressBar className="z-50"/>
        <SessionProvider >
          {children}
        </SessionProvider>
    </NextUIProvider>
  )
}
