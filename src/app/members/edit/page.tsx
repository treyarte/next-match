import { CardBody, CardHeader, Divider } from '@nextui-org/react'
import React from 'react'
import EditForm from './EditForm'
import { getAuthUserId } from '@/actions/authActions'
import { getMemberByUserId } from '@/actions/memberActions';

export default async function EditPage() {
  const userId = await getAuthUserId();
  const member = await getMemberByUserId(userId);

  if(!member) {return;}

  return (
    <>
    <CardHeader className='text-2xl font-semibold text-secondary'>
      Edit Profile
    </CardHeader>
    <Divider/>
    <CardBody>
      <EditForm 
        member={member}/>
    </CardBody>
    </>
  )
}
