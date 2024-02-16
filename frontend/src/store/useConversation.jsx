import { create } from 'zustand';

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set(() => ({ selectedConversation })),
  messages: [],
  setMessages: (messages) => set(() => ({ messages })),
  lastMessages: [],
  setLastMessages: (lastMessages) => set(() => ({ lastMessages })),
}));

export default useConversation;
