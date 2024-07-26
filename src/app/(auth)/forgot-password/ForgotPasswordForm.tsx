'use client';
import { generatePasswordReset } from '@/actions/authActions';
import CardWrapper from '@/components/CardWrapper';
import ResultMessage from '@/components/ResultMessage';
import { ActionResults } from '@/types';
import { Button, Input } from '@nextui-org/react';
import React, { useState } from 'react'
import { FieldValue, FieldValues, useForm } from 'react-hook-form';
import { IconBaseProps } from 'react-icons';
import { GiPadlock } from 'react-icons/gi';

export default function ForgotPasswordForm() {
    const [result, setResult] = useState<ActionResults<string> | null>(null);
    const {register, handleSubmit, reset, formState: {errors, isSubmitting, isValid}} = useForm();

    const onSubmit = async (data:FieldValues) => {
        setResult(await generatePasswordReset(data.email))
        reset();
    } 

  return (
    <CardWrapper 
        headerIcon={GiPadlock } 
        headerText={'Forgot Password'}    
        subHeaderText='Please enter your email address'
        body={
            <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
                <Input 
                    type='email'
                    placeholder='Email Address'
                    variant='bordered'
                    defaultValue=''
                    {...register('email', {required: true})}                    
                />
                <Button type='submit' color='secondary' isLoading={isSubmitting} isDisabled={!isValid}>
                    Send Reset Email
                </Button>
         </form>
        }
        footer = {
            <ResultMessage result={result} />
        }
    />
  )
}
