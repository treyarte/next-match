'use client';

import { signOutUser } from '@/actions/authActions';
import { auth, signOut } from '@/auth'
import { Avatar, Dropdown, DropdownItem, DropdownMenu, DropdownSection, DropdownTrigger } from '@nextui-org/react'
import { Session } from 'next-auth'
import { useSession } from 'next-auth/react';
import Link from 'next/link'
import React, { useEffect } from 'react'

type props = {
  user: Session['user']
}

export default function UserMenu({user}: props) {
  const {data: session, update} = useSession();
  
  return (
    <Dropdown placement='bottom-end' >
      <DropdownTrigger>
        <Avatar 
          isBordered
          as='button'
          className='transition-transform'
          name={user?.name || "user avatar"}
          size='sm'
          src={session?.user?.image || '/images/user.png'}
        />
      </DropdownTrigger>
      <DropdownMenu variant='flat' artia-label='User actions menu'>
        <DropdownSection showDivider>
          <DropdownItem isReadOnly as='span' className='h14 flex flex-row' aria-label='username'>
            Signed in as {session?.user?.name}
          </DropdownItem>
        </DropdownSection>
        <DropdownItem as={Link} href='/members/edit'>
          Edit profile
        </DropdownItem>
        <DropdownItem color='danger' onClick={async () => signOutUser()}>
          Log out
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  )
}
