import { pusherClient } from "@/libs/pusher";
import { MessageDto } from "@/types";
import { usePathname, useSearchParams } from "next/navigation";
import { Channel } from "pusher-js";
import { useCallback, useEffect, useRef } from "react"
import useMessageStore from "./useMessageStore";
import { toast } from "react-toastify";

export const useNotificationChannel = (userId:string|null) => {
    const channelRef = useRef<Channel | null>(null);
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const {add} = useMessageStore(state => ({
        add:state.add
    }))

    const handleNewMessage = useCallback((message:MessageDto) => {
        if(pathname === '/messages' && searchParams.get('container') !== 'outbox') {
            add(message);
        } else if (pathname !== `/members/${message.senderId}/chat`) {
            toast.info(`New message from ${message.senderName}`);
        }

    }, [add, pathname, searchParams]);

    useEffect(() => {
        if(userId) return;
        if(!channelRef.current) {
            channelRef.current = pusherClient.subscribe(`private-${userId}`);

            channelRef.current.bind('message:new', handleNewMessage);
        }

        return () => {
            if(channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind('message:new', handleNewMessage)
                channelRef.current = null;
            }
        }
    },[handleNewMessage, userId]);
}