'use client';

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
      {children}
    </NavbarItem>
  )
}
