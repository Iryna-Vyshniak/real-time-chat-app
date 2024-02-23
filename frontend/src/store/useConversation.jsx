import { create } from 'zustand';

const useConversation = create((set) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  lastMessages: [],
  setLastMessages: (lastMessages) => set({ lastMessages }),
  notification: [],
  setNotification: (notification) => set({ notification }),
  conversationId: null,
  setConversationId: (conversationId) => set({ conversationId }),
}));

export default useConversation;
