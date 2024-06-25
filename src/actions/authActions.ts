'use server';

import { RegisterSchema, registerSchema } from "@/app/schemas/registerSchema";
import { checkEmailInUse, createUser } from "@/repos/usersRepo";
import { User } from "@prisma/client";
import { ActionResults } from "@/types";
import { LoginSchema } from "@/app/schemas/loginSchema";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";

export async function signInUser(data:LoginSchema) : Promise<ActionResults<string>> {
  try {
    const result = await signIn('credentials', {
      email: data.email,
      password: data.password,
      redirect:false
    });
    console.log(result);
    return {status: 'success', data: 'user logged in'}
  } catch (error) {
    console.error(error);
    if(error instanceof AuthError) {
      return {status: 'error', error:"Invalid Credentials"}

    } else {
      return {status: 'error', error: 'something else went wrong'}
    }
  }
}

export async function signOutUser() {
  await signOut({redirectTo: '/'});
}

/**
 * Server action to register a new user to our site
 * @param data 
 * @returns 
 */
export async function registerUser(data:RegisterSchema) : Promise<ActionResults<User>> {
  try {
    const validated = registerSchema.safeParse(data);

    if(!validated.success) {      
      return {status: 'error', error: validated.error?.errors};
    }
  
    const user = validated.data;
  
    const isEmailInUse = await checkEmailInUse(user.email);
  
    if(isEmailInUse) {
      return {status: 'error', error: "A user with that email already exists"};      
    }
  
    const newUser = await createUser(user);

    return {status: 'success', data:newUser}

  } catch (error) {
    console.log(error);
    return {status: 'error', error: "Something went wrong"};
  }
}

/**
 * Gets the current logged in user id
 */
export async function getAuthUserId() : Promise<string> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if(!userId) {
      throw new Error('Unauthorized')
    }
    
    return userId;

  } catch (error) {
    console.error(error);
    throw error;
  }
}