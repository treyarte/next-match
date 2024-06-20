'use server';

import { auth } from "@/auth";
import { prisma } from "@/libs/prisma";
import { getAuthUserId } from "./authActions";

export async function toggleLikeMember(targetUserId:string, isLiked:boolean) {
  try {

    const userId = await getAuthUserId();

    if(isLiked) {
      await prisma.like.delete({
        where: {sourceUserId_targetUserId: {
          sourceUserId: userId,
          targetUserId
        }}
      });
    } else {
      await prisma.like.create({
        data: {
          sourceUserId:userId,
          targetUserId
        }
      })
    }

  } catch (error) {
    console.error(error);
    throw error;    
  }
}

export async function fetchCurrentUserLikeIds() {
  try {
    const userId = await getAuthUserId();

    const likes = await prisma.like.findMany({
      where: {
        sourceUserId:userId
      },
      select: {targetUserId:true}
    });

    const likeUserIds = likes.map(l => l.targetUserId);

    return likeUserIds;

  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function fetchLikeMembers(type = 'source') {
  const userId = await getAuthUserId();
  try {
    switch (type) {
      case 'source':        
        return await fetchSourceLikes(userId);
      case 'target':
        return await fetchTargetLikes(userId);
      case 'mutual':
        return await fetchMutualLikes(userId);
  
      default:
        return [];
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function fetchSourceLikes(userId:string) {
  const likes = await prisma.like.findMany({
    where: {
      sourceUserId:userId
    },
    select: {
      targetMember:true
    }
  })

  return likes.map(l => l.targetMember);
}

async function fetchTargetLikes(userId:string) {
  const likes = await prisma.like.findMany({
    where: {
      targetUserId:userId
    },
    select: {
      sourceMember:true
    }
  })

  return likes.map(l => l.sourceMember);
}

async function fetchMutualLikes(userId:string) {
  const likes = await prisma.like.findMany({
    where: {sourceUserId:userId},
    select: {targetUserId:true}
  });

  const likeIds = likes.map(l => l.targetUserId);

  const mutualLikes = await prisma.like.findMany({
    where: {
      AND: [
        {targetUserId: userId},
        {sourceUserId: {in: likeIds}}
      ]
    },
    select: {sourceMember: true}
  });

  return mutualLikes.map(ml => ml.sourceMember);
}

