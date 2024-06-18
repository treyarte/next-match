import { getMemberByUserId } from '@/actions/memberActions'
import { notFound } from 'next/navigation';
import React from 'react'
import MemberSidebar from '../MemberSidebar';

export default async function MembersDetailsPage({params}: {params: {userId: string}}) {
  const member = await getMemberByUserId(params.userId);

  if(!member) return notFound();

  return (
    <div><MemberSidebar member={member}/></div>
  )
}
