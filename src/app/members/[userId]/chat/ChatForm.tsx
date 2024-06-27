'use client';
import { createMessage } from '@/actions/messageActions';
import { MessageSchema, messageSchema } from '@/app/schemas/messageSchema'
import { handleFormServerErrors } from '@/libs/util';
import { zodResolver } from '@hookform/resolvers/zod'
import { Button, Input } from '@nextui-org/react'
import { useParams, useRouter } from 'next/navigation';
import React from 'react'
import { useForm } from 'react-hook-form'
import { HiPaperAirplane } from 'react-icons/hi2'

export default function ChatForm() {
  const router = useRouter();
  const params = useParams<{userId:string}>()

  const {register, handleSubmit, reset, setError, formState: {isValid, isDirty, isSubmitting, errors}} = useForm<MessageSchema>({
    resolver: zodResolver(messageSchema)
  })



  const onSubmit = async (data:MessageSchema) => {
    const res = await createMessage(params.userId, data);

    if(res.status === 'error') {
      handleFormServerErrors(res, setError);
    } else {
      reset();
      router.refresh();
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
      <div className='flex items-center gap-2'>
        <Input 
          fullWidth
          placeholder='Slide in em dms'
          variant='faded'
          {...register('text')}
          isInvalid={!!errors.text}
          errorMessage={errors.text?.message}
        />
        <Button
          type='submit'
          isIconOnly
          color='secondary'
          radius='full'
          isLoading={isSubmitting}
          isDisabled={!isValid || isSubmitting}
        >
          <HiPaperAirplane />
        </Button>
      </div>

      <div className="flex flex-col">
        {errors.root?.serverError && (
          <p className='text-danger text-sm'>{errors.root.serverError.message}</p>
        )}
      </div>
    </form>
  )
}
