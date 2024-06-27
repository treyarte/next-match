import { getMemberByUserId } from '@/actions/memberActions'
import { notFound } from 'next/navigation';
import React from 'react'
import MemberSidebar from '../MemberSidebar';
import { CardHeader, Divider, CardBody } from '@nextui-org/react';
import CardInnerWrapper from '@/components/CardInnerWrapper';

export default async function MembersDetailsPage({params}: {params: {userId: string}}) {
  const member = await getMemberByUserId(params.userId);

  if(!member) return notFound();

  return (
    <CardInnerWrapper 
      header='Profile'
      body={<div>{member.description}</div>}
    />
  )
}
