import { getMembers } from '@/actions/memberActions'
import Link from 'next/link'
import React from 'react'
import MemberCard from './MemberCard';
import { fetchCurrentUserLikeIds } from '@/actions/likeActions';
import PaginationComponent from '@/components/PaginationComponent';
import { UserFilters } from '@/types';

export default async function MembersPage({searchParams}: {searchParams:UserFilters}) {
  const members = await getMembers(searchParams);
  const likeIds = await fetchCurrentUserLikeIds();
  return (
    <>
        <div className='mt-10 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8'>
        {members && members.map(member => (
          <MemberCard key={member.id} member={member} likeIds={likeIds}/>
        ))}  
      
        <Link href="/">Go back</Link>
      </div>
      <PaginationComponent />
    </>
  )
}
