'use client';

import useMessageStore from '@/hooks/useMessageStore';
import { NavbarItem } from '@nextui-org/react'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React from 'react'

type props = {
    href:string
    children?:React.ReactNode;
}

export default function NavLink({href, children}:props) {
  const pathName = usePathname();
  const {unreadCount} = useMessageStore((state) => ({
    unreadCount:state.unreadCount
  }));

  /**
   * Checks if the href is the current active link
   */
  const checkIsActive = () => {
    return href == pathName;
  } 
  return (
    <NavbarItem 
      as={Link} 
      href={href}
      isActive={checkIsActive()} 
    >
      <span>{children}</span>
      {href === '/messages' && (
        <span className='ml-1 '>({unreadCount})</span>
      )}
    </NavbarItem>
  )
}
