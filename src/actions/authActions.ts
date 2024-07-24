'use server';

import { combinedRegisterSchema, RegisterSchema, registerSchema } from "@/app/schemas/registerSchema";
import { checkEmailInUse, createUser, getUserByEmail } from "@/repos/usersRepo";
import { TokenType, User } from "@prisma/client";
import { ActionResults } from "@/types";
import { LoginSchema } from "@/app/schemas/loginSchema";
import { AuthError } from "next-auth";
import { auth, signIn, signOut } from "@/auth";
import { generateToken, getTokenByToken } from "@/libs/tokens";
import { resetPasswordEmail, sendVerificationEmail } from "@/libs/mail";
import { prisma } from "@/libs/prisma";
import { hashPassword } from "@/libs/bcryptHelpers";

export async function signInUser(data:LoginSchema) : Promise<ActionResults<string>> {
  try {
    const existingUser = await getUserByEmail(data.email);

    if(!existingUser || !existingUser.email) return {status: 'error', error: 'Invalid credentials'}

    if(!existingUser.emailVerified) {
      const token = await generateToken(existingUser.email, TokenType.VERIFICATION)

      await sendVerificationEmail(token.email, token.token);
      return {status: 'error', error: 'Please verify your email'}
    }

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
    const validated = combinedRegisterSchema.safeParse(data);

    if(!validated.success) {      
      return {status: 'error', error: validated.error?.errors};
    }
  
    const {name, email, password, gender, description, dateOfBirth, city, country} = validated.data;
  
    const isEmailInUse = await checkEmailInUse(email);
  
    if(isEmailInUse) {
      return {status: 'error', error: "A user with that email already exists"};      
    }
  
    const newUser = await createUser({
      name, 
      email, 
      password,
      gender,
      description,
      city,
      country,
      dateOfBirth
    });

    const verificationToken = await generateToken(email, TokenType.VERIFICATION);

    // Send email
    await sendVerificationEmail(verificationToken.email, verificationToken.token);

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

export async function verifyEmail(token:string) : Promise<ActionResults<string>> {
  try {
    const existingToken = await getTokenByToken(token);

    if(!existingToken) {
      return {status: 'error', error: 'Invalid token'}
    }
    
    const hasExpired = new Date() > existingToken.expires;
    
    if(hasExpired) {      
      return {status: 'error', error: 'Token has expired'}
    }
    
    const existingUser = await getUserByEmail(existingToken.email);
    
    if(!existingUser) {
      return {status: 'error', error: 'User not found'}      
    }

    await prisma.user.update({
      where:{id:existingUser.id},
      data:{emailVerified: new Date()}
    });

    await prisma.token.delete({where: {id: existingToken.id}});

    return {status: 'success', data: 'Success'}

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function generatePasswordReset(email:string) : Promise<ActionResults<string>> {
  try {
    const existingUser = await getUserByEmail(email);

    if(!existingUser) {
      return {status: 'error', error: "Email not found"};
    }

    const token = await generateToken(email, TokenType.PASSWORD_RESET);

    await resetPasswordEmail(token.email, token.token);

    return {status: 'success', data: 'Password reset email has been sent. Please check your email.'}

  } catch (error) {
    console.error(error);
    return {status: 'error', error: "Something went wrong"};
  }
}

export async function resetPassword(password:string, token:string | null) : Promise<ActionResults<string>> {
  try {
    
    if(!token) return {status: 'error', error: 'Missing token'};

    const existingToken = await getTokenByToken(token);

    if(!existingToken) {
      return {status: 'error', error: 'Invalid token'}
    }
    
    const hasExpired = new Date() > existingToken.expires;
    
    if(hasExpired) {      
      return {status: 'error', error: 'Token has expired'}
    }
    
    const existingUser = await getUserByEmail(existingToken.email);
    
    if(!existingUser) {
      return {status: 'error', error: 'User not found'}      
    }

    const hashedPassword = await hashPassword(password);

    await prisma.user.update({
      where: {id: existingUser.id},
      data: {passwordHash: hashedPassword}
    });

    await prisma.token.delete({where: {id: existingToken.id}});

    return {status: 'success', data: 'Password updated successfully'};
  } catch (error) {
    console.error(error);
    return {status: 'error', error: "Something went wrong"};
  }
}