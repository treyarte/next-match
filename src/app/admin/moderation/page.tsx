import { getUnapprovedPhotos } from '@/actions/adminActions'
import MemberPhotos from '@/components/MemberPhotos';
import { Divider } from '@nextui-org/react';
import React from 'react'

export default async function PhotoModerationPage() {
  const photos = await getUnapprovedPhotos();

  return (
    <div className="flex flex-col mt-10 gap-3">
      <h3 className="text-2xl">Photos awaiting moderation</h3>
      <Divider />
      <MemberPhotos photos={photos} />
    </div>  
  )
}
