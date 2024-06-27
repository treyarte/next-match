'use client';

import LikeButton from "@/components/LikeButton"
import { calculateAge, transformImageUrl } from "@/libs/util"
import { Card, CardFooter, Image } from "@nextui-org/react"
import { Member } from "@prisma/client"
import Link from "next/link"

type props = {
  member:Member;
  likeIds:string[];
}

export default function MemberCard({member, likeIds}:props) {
const hasLike = likeIds.includes(member.userId);

  const preventLinkAction = (e:React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }

  return (
    <Card 
      fullWidth
      as={Link}
      href={`/members/${member.userId}`}
      isPressable
    >
      <Image
        isZoomed
        alt={member.name}
        width={300} 
        src={transformImageUrl(member.image) || '/images/user.png'}
        className='aspect-square object-cover'
      />
      <div onClick={preventLinkAction}>
        <div className="absolute top-3 right-3 z-50">        
          <LikeButton targetId={member.userId} hasLiked={hasLike} />
        </div>
      </div>
      <CardFooter className="flex justify-start bg-dark-gradient overflow-hidden absolute bottom-0 z-10">
        <div className="flex flex-col text-white">
          <span className="font-semibold">{member.name}, {calculateAge(member.dateOfBirth)}</span>
          <span className="text-sm">{member.city}</span>
        </div>
      </CardFooter>
    </Card>
  )
}
