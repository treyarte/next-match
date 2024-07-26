import { pusherClient } from "@/libs/pusher";
import { MessageDto } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react"
import useMessageStore from "./useMessageStore";
import { toast } from "react-toastify";
import { newMessageToast } from "@/components/NewMessageToast";
import { Member } from "@prisma/client";
import { likesToast } from "@/components/LikesToast";

export const useNotificationChannel = (userId:string|null,  profileComplete:boolean) => {
    const channelRef = useRef<Channel | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {add, updateUnreadCount} = useMessageStore(state => ({
        add:state.add,
        updateUnreadCount:state.updateUnreadCount
    }))

    const handleNewMessage = useCallback((message:MessageDto) => {
        if(pathname === '/messages' && searchParams.get('container') !== 'outbox') {
            add(message);
            updateUnreadCount(1);
        } else if (pathname !== `/members/${message.senderId}/chat`) {
            newMessageToast(message);
            updateUnreadCount(1);
        }

    }, [add, pathname, searchParams, updateUnreadCount]);

    const handleLike = useCallback((sourceMember:Member) => {        
        likesToast(sourceMember);
    }, []);

    useEffect(() => {
        if(!userId || !profileComplete) return;
        if(!channelRef.current) {
            channelRef.current = pusherClient.subscribe(`private-${userId}`);

            channelRef.current.bind('message:new', handleNewMessage);
            channelRef.current.bind('likes:new', handleLike);
        }
        
        return () => {
            if(channelRef.current && channelRef.current.subscribed) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage)
                channelRef.current.unbind('likes:new', handleLike);
                channelRef.current = null;
            }
        }
    },[handleLike, handleNewMessage, profileComplete, userId]);
}