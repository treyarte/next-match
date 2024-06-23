import { memberEditSchema } from '@/app/schemas/memberEditSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { CardHeader, Divider, CardBody } from '@nextui-org/react'
import React from 'react'
import { useForm } from 'react-hook-form'

export default function EditForm() {
  const {register, handleSubmit, reset, formState: {isValid, isDirty, isSubmitting}} = useForm({
    resolver:zodResolver(memberEditSchema)
  });

  return (
    <>
      <CardHeader className='text-2xl font-semibold text-secondary'>
        Edit Profile
      </CardHeader>
      <Divider/>
      <CardBody>
        Edit Form
      </CardBody>
  </>
  )
}
