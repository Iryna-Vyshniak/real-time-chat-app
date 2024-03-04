import { create } from 'zustand';

const useConversation = create((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessages(newMessage) {
    const messages = [...get().messages, newMessage];
    set({ messages });
  },
  lastMessages: [],
  setLastMessages: (lastMessages) => set({ lastMessages }),
  notification: [],
  setNotification: (notification) => set({ notification }),
  conversationId: null,
  setConversationId: (conversationId) => set({ conversationId }),
  mediaFile: null,
  setMediaFile: (mediaFile) => set({ mediaFile }),
  mediaUrl: null,
  setMediaUrl: (mediaUrl) => set({ mediaUrl }),
}));

export default useConversation;
