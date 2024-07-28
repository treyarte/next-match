import React from 'react'
import ListsTab from './ListsTab'
import { fetchCurrentUserLikeIds, fetchLikeMembers } from '@/actions/likeActions'

export const dynamic = 'force-dynamic';

export default async function ListPage({searchParams}: {searchParams: {type:string}}) {
  const likeIds = await fetchCurrentUserLikeIds();
  const members = await fetchLikeMembers(searchParams.type);
  return (
    <div>
      <ListsTab members={members} likeIds={likeIds}/>
    </div>
  )
}
