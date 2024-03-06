import { create } from 'zustand';

const useConversation = create((set, get) => ({
  selectedConversation: null,
  setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessages(newMessages) {
    set((prev) => {
      // filter new messages to exclude those that are already in the list
      const uniqueNewMessages = newMessages.filter((newMessage) => {
        return !prev.messages.some((prevMessage) => prevMessage._id === newMessage._id);
      });

      // return a new state by adding unique new messages to the list
      return {
        messages: [...prev.messages, ...uniqueNewMessages],
      };
    });
  },
  addMessage(newMessage) {
    const messages = [...get().messages, newMessage];
    set({ messages });
  },
  totalPages: 0,
  setTotalPages: (totalPages) => set({ totalPages }),
  currentPage: 1,
  setCurrentPage: (currentPage) => set({ currentPage }),
  limit: 6,
  setLimit: (limit) => set({ limit }),
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
