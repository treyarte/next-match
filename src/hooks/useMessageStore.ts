import { MessageDto } from "@/types"
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type MessageState = { 
    messages:MessageDto[];
    add:(message:MessageDto) => void;
    remove:(id:string) => void;
    set: (message:MessageDto[]) => void;
}

const useMessageStore = create<MessageState>()(devtools((set) => ({
    messages: [],
    add: (message) => set(state => ({messages: [message, ...state.messages]})),
    remove:(id) => set(state => ({messages: state.messages.filter(message => message.id !== id)})),
    set: (messages) => set({messages})
}), {name: 'messageStoreDemo'}))

export default useMessageStore;