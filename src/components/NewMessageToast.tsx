import { transformImageUrl } from '@/libs/util';
import { MessageDto } from '@/types';
import { toast } from 'react-toastify';
import ToastNotification from './ToastNotification';


export const newMessageToast = (message:MessageDto) => {
    toast(
        <ToastNotification             
            link={`/members/${message.senderId}/chat`} 
            imgSrc={transformImageUrl(message.senderImage) || '/images/user.png'} 
            text={`${message.senderName} sent you a message`}
        />
    )
}