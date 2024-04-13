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
    deleteMessage: (id) =>
      set((state) => ({ messages: state.messages.filter((message) => message._id !== id) })),
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

        if (isCurrentMessage) {
          return { ...message, emoji };
        }
        return message;
      });
      // Update the state with the new messages
      set({ messages: updatedMessages });
    },
    deleteEmoji: (messageId) => {
      const messages = get().messages;
      if (!Array.isArray(messages)) {
        console.error('Error: messages is not an array');
        return;
      }
      const updatedMessages = messages.map((message) => {
        const isCurrentMessage = message._id === messageId;

        if (isCurrentMessage) {
          return { ...message, emoji: '' };
        }
        return message;
      });
      // Update the state with the new messages
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
    audioUrl: null,
    setAudioUrl: (audioUrl) => set({ audioUrl }),
    videoUrl: null,
    setVideoUrl: (videoUrl) => set({ videoUrl }),
    // emoji
    selectedEmojis: {},
    setSelectedEmoji: (messageId, emoji) => {
      set((state) => ({
        selectedEmojis: { ...state.selectedEmojis, [messageId]: emoji },
      }));
    },
    selectedMessage: null,
    setSelectedMessage: (messageId, text) => {
      if (messageId === null && text === undefined) {
        set({ selectedMessage: null });
      } else {
        set({ selectedMessage: { messageId, text } });
      }
    },
    // notifications
    lastMessages: [],
    setLastMessages: (lastMessages) => set({ lastMessages }),
    notification: [],
    setNotification: (notification) => set({ notification }),
    deleteNotification: (id) => set((state) => state.notification.filter((n) => n._id !== id)),
    // CONVERSATION
    conversations: [],
    setConversations: (conversations) => set({ conversations }),
    selectedConversation: null,
    setSelectedConversation: (conversation) => {
      if (conversation !== null) {
        const { type, data } = conversation;
        set({ selectedConversation: { type, data } });
      } else {
        set({ selectedConversation: null });
      }
    },
    conversationId: null,
    setConversationId: (conversationId) => set({ conversationId }),
    // GROUPS
    groups: [],
    setGroups: (groups) => set({ groups }),
    onlineGroupUsers: [],
    setOnlineGroupUsers: ({ room, onlineUsers }) =>
      set({ onlineGroupUsers: { room, onlineUsers } }),

    // initial values for modal groups
    initialGroupChatName: null,
    setInitialGroupChatName: (groupChatName) => set({ initialGroupChatName: groupChatName }),
    initialSelectedUsers: null,
    setInitialSelectedUsers: (selectedUsers) => set({ initialSelectedUsers: selectedUsers }),
    initialImgUrl: null,
    setInitialImgUrl: (imgUrl) => set({ initialImgUrl: imgUrl }),
  }),
  shallow
);

export default useConversation;
