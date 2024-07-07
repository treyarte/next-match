'use client'

import { useNotificationChannel } from '@/hooks/useNotificationChannel';
import { usePresenceChannel } from '@/hooks/usePresenceChannel';
import { NextUIProvider } from '@nextui-org/react'
import { SessionProvider, getSession } from 'next-auth/react';
import React, { ReactNode } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

export default function Providers({children, userId} : {children:ReactNode, userId:string|null}) {
  usePresenceChannel();
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
