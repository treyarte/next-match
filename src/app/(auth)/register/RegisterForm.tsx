'use client';
import { registerUser } from '@/actions/authActions';
import { RegisterSchema, registerSchema } from '@/app/schemas/registerSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import React from 'react'
import { useForm } from 'react-hook-form';
import { FaUserPlus } from 'react-icons/fa6';

export default function RegisterForm() {
  const {register, handleSubmit, formState: {errors, isValid, isSubmitting}, setError} = useForm<RegisterSchema>({
    // resolver: zodResolver(registerSchema),
    mode: 'onTouched'

  });

  const onSubmit = async (data:RegisterSchema) => {
    const res = await registerUser(data);

    if(res.status === 'success') {
      console.log('User successfully created');
      return;
    }

    if(Array.isArray(res.error)) {
      res.error.forEach(e => {
        const fieldName = e.path.join('.') as 'email' | 'password' | 'name';
        setError(fieldName, {message: e.message});
      })
    } else {
      setError("root.serverError", {message: res.error});
    }
    
  }

  return (
    <Card className="w-2/5 mx-auto">
      <CardHeader className='flex flex-col items-center justify-center'>
        <div className="flex flex-col gap-2 items-center text-secondary">
          <div className="flex flex-row items-center gap-3">
            <FaUserPlus size={30}/>
            <h1 className="text-3xl font-semibold">Register</h1>
          </div>
          <p className="text-neutral-500">Sign up to find matches near you</p>
        </div>
      </CardHeader>
      <CardBody>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="space-y-4">
            <Input
              label='Name'
              variant='bordered'
              {...register('name')}
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
            />
            <Input
              label='Email'
              variant='bordered'
              {...register('email')}
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              />
            <Input
              label='Password'
              variant='bordered'
              type='password'
              {...register('password')}
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
            />
            {errors.root?.serverError && (
              <p className="text-danger text-sm">{errors.root.serverError.message}</p>
            )}
            <Button
              isLoading={isSubmitting}
              fullWidth
              isDisabled={!isValid} 
              color='secondary' 
              type='submit'
            >
              Register
            </Button>
          </div>
        </form>
      </CardBody>
    </Card>
  )
}
