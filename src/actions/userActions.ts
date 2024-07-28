'use server';

import { MemberEditSchema, memberEditSchema } from "@/app/schemas/memberEditSchema";
import { Member, Photo } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/libs/prisma";
import { ActionResults } from "@/types";
import { cloudinary } from "@/libs/cloudinary";


export async function updateMemberProfile(data:MemberEditSchema) : Promise<ActionResults<Member>> {
  try {
    const userId = await getAuthUserId();

    const validated = memberEditSchema.safeParse(data);

    if(!validated.success) {
      return {status: 'error', error: validated.error.errors}
    }

    const {
      name,
      description,
      city,
      country,
    } = validated.data;

    const member = await prisma.member.update({
      where: {userId},
      data: {
        name,
        description,
        city,
        country,
      }
    });

    return {status: 'success', data: member}

  } catch (error) {
    console.error(error);
    return {status: 'error', error: 'Something went wrong'}
  }
}

export async function addImage(url:string, publicId:string) {
  try {
    const userId = await getAuthUserId();
    
    return prisma.member.update({
      where: {userId},
      data: {
        photos: {
          create: [
            {
              url,
              publicId
            }
          ]
        }
      }
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function setMainPhoto(photo:Photo) {
  if(!photo.isApproved) throw new Error("Only approved photos can be set to main image");
  try {
      const userId = await getAuthUserId();

      await prisma.user.update({
        where: {id: userId},
        data: {
          image: photo.url
        }
      });

      return prisma.member.update({
        where: {userId},
        data: {
          image:photo.url
        }
      });

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function deletePhoto(photo:Photo) {
  try {  
    const userId = await getAuthUserId();

    if(photo.publicId) {
      await cloudinary.v2.uploader.destroy(photo.publicId);
    }

    await prisma.member.update({
      where: {userId},
      data: {
        photos: {
          delete: {id: photo.id}
        }
      }
    })

  } catch (error) {
    console.error(error);
    throw error;
  }
}