import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

const useConversation = createWithEqualityFn(
  (set, get) => ({
    // MESSAGES
    // loading
    isLoading: false,
    setIsLoading: (value) => set({ isLoading: value }),
    // messages
    messages: [],
    setMessages: (messages) => set({ messages }),
    addMessages: (newMessages) => {
      set((state) => ({ messages: [...state.messages, ...newMessages] }));
    },
    addMessage: (newMessage) => {
      set((state) => ({ messages: [...state.messages, newMessage] }));
    },
    updateMessagesStatus: (conversationId) => {
      const messages = get().messages;
      const selectedConversation = get().selectedConversation;
      if (!Array.isArray(messages)) {
        console.error('Error: messages is not an array');
        return;
      }
      const updatedMessages = messages.map((message) => {
        const isCurrentConversation = message.conversationId === conversationId;
        // Check if the current user is not the sender of the message
        const isInCommonChat =
          selectedConversation && selectedConversation._id !== message.sender._id;
        if (isInCommonChat && isCurrentConversation && !message.read) {
          return { ...message, read: true };
        }
        return message;
      });

      set({ messages: updatedMessages });
    },
    addEmoji: (messageId, emoji) => {
      const messages = get().messages;
      if (!Array.isArray(messages)) {
        console.error('Error: messages is not an array');
        return;
      }
      const updatedMessages = messages.map((message) => {
        const isCurrentMessage = message._id === messageId;

        if (isCurrentMessage && message.emoji === '') {
          return { ...message, emoji };
        }
        return message;
      });

      set({ messages: updatedMessages });
    },
    totalPages: 0,
    setTotalPages: (totalPages) => set({ totalPages }),
    currentPage: 1,
    setCurrentPage: (page) => set({ currentPage: page }),
    resetCurrentPage: () => set({ currentPage: 1 }),
    limit: 6,
    setLimit: (limit) => set({ limit }),
    // media
    mediaFile: null,
    setMediaFile: (mediaFile) => set({ mediaFile }),
    mediaUrl: null,
    setMediaUrl: (mediaUrl) => set({ mediaUrl }),
    // emoji
    selectedEmojis: {},
    setSelectedEmoji: (messageId, emoji) => {
      set((state) => ({
        selectedEmojis: { ...state.selectedEmojis, [messageId]: emoji },
      }));
    },
    // notifications
    lastMessages: [],
    setLastMessages: (lastMessages) => set({ lastMessages }),
    notification: [],
    setNotification: (notification) => set({ notification }),
    // CONVERSATION
    conversations: [],
    setConversations: (conversations) => set({ conversations }),
    selectedConversation: null,
    setSelectedConversation: (selectedConversation) => set({ selectedConversation }),
    conversationId: null,
    setConversationId: (conversationId) => set({ conversationId }),
  }),
  shallow
);

export default useConversation;
