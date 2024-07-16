'use client';

import { usePathname } from 'next/navigation';
import React from 'react'
import Filters from './Filters';

export default function FilterWrapper() {
    const pathname = usePathname();

  if(pathname === '/members') return <Filters/>
  else return null;
}
