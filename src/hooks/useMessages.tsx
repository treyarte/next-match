import { deleteMessage } from "@/actions/messageActions";
import { MessageDto } from "@/types";
import { useRouter, useSearchParams } from "next/navigation";

import { useState, useCallback, useEffect } from "react";
import { Key } from "readline";
import useMessageStore from "./useMessageStore";

export const useMessages = (initialMessages:MessageDto[]) => {
    const {set, remove, messages} = useMessageStore(state => ({
      set:state.set,
      remove:state.remove,
      messages:state.messages
    }))
    const searchParams = useSearchParams();
    const router = useRouter();
    const [isDeleting, setDeleting] = useState({id: '', loading: false})
    const isOutbox = searchParams.get('container') === 'outbox'
    
    useEffect(() => {
      set(initialMessages);

      return () => {
        set([])
      }
    }, [initialMessages, set]);
    
  
    const columns = [
      {key: isOutbox ? 'recipientName': 'senderName', label: isOutbox ? 'Recipient' : 'Sender'},
      {key: 'text', label: 'Message'},
      {key: 'created', label: isOutbox ? 'Date sent': 'Date received'},
      {key: 'actions', label: 'Actions'}
    ]
  
    const handleDeleteMessage = useCallback(async(message:MessageDto) => { 
      setDeleting({id:message.id, loading:true});
      await deleteMessage(message.id, isOutbox);
      router.refresh();
      setDeleting({id:'', loading:false});
    },[isOutbox, router])
  
    const handleRowSelect = (key:Key) => {
      const message = messages.find(m => m.id === key);
      const url = isOutbox ? `/members/${message?.recipientId}` : `/members/${message?.senderId}`;
      router.push(url + '/chat');
    }

    return {
        isOutbox,
        columns,
        deleteMessage:handleDeleteMessage,
        selectRow:handleRowSelect,
        isDeleting,
        messages

    }
}