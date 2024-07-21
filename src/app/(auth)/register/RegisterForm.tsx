'use client';
import { registerUser } from '@/actions/authActions';
import { profileSchema, RegisterSchema, registerSchema } from '@/app/schemas/registerSchema';
import { handleFormServerErrors } from '@/libs/util';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Card, CardBody, CardHeader, Input } from '@nextui-org/react';
import React, { useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { FaUserPlus } from 'react-icons/fa6';
import UserDetailsForm from './UserDetailsForm';
import ProfileForm from './ProfileForm';
import { useRouter } from 'next/navigation';

const stepSchemas = [registerSchema, profileSchema];

export default function RegisterForm() {
  const router = useRouter();
  const [activeStep, setActiveStep] = useState(0);
  const currentValidationSchema = stepSchemas[activeStep];

  const methods= useForm<RegisterSchema>({
    resolver: zodResolver(currentValidationSchema),
    mode: 'onTouched'

  });

  const {handleSubmit, formState: {errors, isValid, isSubmitting}, setError, getValues} = methods;

  const onSubmit = async () => {    
    const res = await registerUser(getValues());

    if(res.status === 'success') {
      router.push('/register/success');
      return;
    }

    handleFormServerErrors(res, setError);
    
  }

  const getStepContent = (step:number) => {
    switch(step) {
      case 0:
        return <UserDetailsForm />
      case 1:
        return <ProfileForm/>
      default:
        return 'unknown step';
    }
  }

  const onBack = () => {
    setActiveStep(prev => prev - 1);
  }

  const onNext = async () => {
    if(activeStep === stepSchemas.length - 1){
      await onSubmit();
    } else {
      setActiveStep(prev => prev + 1);
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
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onNext)}>
            <div className="space-y-4">
              {getStepContent(activeStep)}
              {errors.root?.serverError && (
                <p className="text-danger text-sm">{errors.root.serverError.message}</p>
              )}
              <div className="flex flex-row items-center gap-6">
                {activeStep !== 0 && (
                  <Button onClick={onBack} fullWidth>
                    Back
                  </Button>
                )}
              </div>
              <Button
                isLoading={isSubmitting}
                fullWidth
                isDisabled={!isValid} 
                color='secondary' 
                type='submit'
              >
                {activeStep === stepSchemas.length - 1 ? 'Submit' : 'Continue'}
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardBody>
    </Card>
  )
}
