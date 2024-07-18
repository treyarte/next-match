'use server';

import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import { GetMemberParams, PaginatedResponse, UserFilters } from "@/types";
import { addYears, min } from "date-fns";
import { getAuthUserId } from "./authActions";
import { Member } from "@prisma/client";

export async function getMembers({
  ageRange = '18,100',
  gender = 'male,female',
  orderBy = 'updated',
  pageNumber = '1',
  pageSize = '12',
  withPhoto = 'false',
}:GetMemberParams) : Promise<PaginatedResponse<Member>> {
  const userId = await getAuthUserId();
  
  const [minAge, maxAge] = ageRange.split(',');  
  const currentDate = new Date();
  const minDob = addYears(currentDate, -maxAge-1);
  const maxDob = addYears(currentDate, -minAge);

  const selectedGender = gender.split(',');
  const hasPhoto = withPhoto === 'true';

  const page = parseInt(pageNumber);
  const limit = parseInt(pageSize);

  const skip = (page - 1) * limit;

  try {
    const count = await prisma.member.count({
      where: {
        AND: [
          {dateOfBirth: {gte:minDob}},
          {dateOfBirth: {lte:maxDob}},
          {gender: {in: selectedGender}},          
        ],
        NOT:{
          userId
        }
      }
    })
    const members = await prisma.member.findMany({
      where: {
        AND: [
          {dateOfBirth: {gte:minDob}},
          {dateOfBirth: {lte:maxDob}},
          {gender: {in: selectedGender}},
          {image: hasPhoto ? {not: null} : {}}
        ],
        NOT:{
          userId
        }
      },
      orderBy: {[orderBy]: 'desc'},
      skip,
      take: limit
    });

    return {
      items:members,
      totalCount: count
    }
    
  } catch (error) {
    console.error(error);    
    throw error;
  }
}

export async function getMemberByUserId(userId:string) {
  try {
    return prisma.member.findUnique({
      where: {userId}
    })
  } catch (error) {
    console.error(error);
  }
}

export async function getMemberPhotosByUserId(userId:string){
  try {
    const member = await prisma.member.findUnique({
      where: {userId},
      select: {photos:true}
    });

    if(!member) {
      return null;
    }

    return member.photos.map(p => p);

  } catch (error) {
    console.error(error)
  }
}

export async function updateLastActive() {
  const userId = await getAuthUserId();

  try {
    return prisma.member.update({
      where: {userId},
      data: {updated: new Date()}
    })
  } catch (error) {
    console.error(error);
    throw error;
  }
}