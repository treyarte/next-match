import { getMemberByUserId } from '@/actions/memberActions'
import { notFound } from 'next/navigation';
import React from 'react'
import MemberSidebar from '../MemberSidebar';
import { CardHeader, Divider, CardBody } from '@nextui-org/react';

export default async function MembersDetailsPage({params}: {params: {userId: string}}) {
  const member = await getMemberByUserId(params.userId);

  if(!member) return notFound();

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Profile
      </CardHeader>
      <Divider/>
      <CardBody>
        {member.description}
      </CardBody>
    </>
  )
}
