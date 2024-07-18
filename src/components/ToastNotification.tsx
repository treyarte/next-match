import { transformImageUrl } from '@/libs/util';
import { MessageDto } from '@/types'
import { Image } from '@nextui-org/react';
import Link from 'next/link';
import React from 'react'
import { toast } from 'react-toastify';

type Props = {
    link:string;
    imgSrc:string;
    text:string;    
}

export default function ToastNotification({link, imgSrc, text}:Props) {
  return (
    // <Link href={`/members/${message.senderId}/chat`} className='flex items-center'>
    <Link href={link} className='flex items-center'>
        <div className="mr-2">
            <Image
                // src={transformImageUrl(message.senderImage) || '/images/user.png'}
                src={imgSrc}
                height={50}
                width={50}
                alt='Sender Image'
            />
        </div>
        <div className="flex flex-grow flex-col justify-center">
            {/* <div className="font-semibold">{message.senderName} sent you a message</div> */}
            <div className="font-semibold">{text}</div>
            <div className="text-sm">Click to view</div>
        </div>
    </Link>
  )
}

