'use client';

import { profileSchema, ProfileSchema } from '@/app/schemas/registerSchema';
import CardWrapper from '@/components/CardWrapper';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react'
import { FormProvider, useForm } from 'react-hook-form';
import { RiProfileLine } from 'react-icons/ri';
import ProfileForm from '../register/ProfileForm';
import { Button } from '@nextui-org/react';
import { completeSocialLoginProfile } from '@/actions/authActions';
import { signIn } from 'next-auth/react';

export default function CompleteProfileForm() {
    const methods = useForm<ProfileSchema>({
        resolver: zodResolver(profileSchema),
        mode:'onTouched'
    });

    const {handleSubmit, formState: {errors, isSubmitting, isValid}} = methods;

    const onSubmit = async(data:ProfileSchema) => {
        const res = await completeSocialLoginProfile(data);

        if(res.status === 'success') {
            signIn(res.data, {
                callbackUrl: '/members'
            })
        }
    }

    return (
        <CardWrapper 
            headerText='About You'
            subHeaderText='Please complete your profile to continue to the app'
            headerIcon={RiProfileLine}
            body={
                <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4">
                    <ProfileForm />
                    {errors.root?.serverError && (
                      <p className="text-danger text-sm">{errors.root.serverError.message}</p>
                    )}
                    <div className="flex flex-row items-center gap-6">
                    <Button
                      isLoading={isSubmitting}
                      fullWidth
                      isDisabled={!isValid} 
                      color='secondary' 
                      type='submit'
                    >
                        Submit
                    </Button>
                    </div>

                  </div>
                </form>
              </FormProvider>
            }
        />
    )
}
