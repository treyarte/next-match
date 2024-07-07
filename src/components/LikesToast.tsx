import { transformImageUrl } from "@/libs/util"
import { MessageDto } from "@/types"
import { toast } from "react-toastify"
import ToastNotification from "./ToastNotification"
import { Member } from "@prisma/client"

export const likesToast = (member:Member) => {
    toast(
        <ToastNotification             
            link={`/members/${member.userId}`} 
            imgSrc={transformImageUrl(member.image) || '/images/user.png'} 
            text={`${member.name} liked you`}
        />
    )
}