import { createWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';

const useConversation = createWithEqualityFn(
  (set, get) => ({
    // SOCKET
    socket: null,
    onlineUsers: [],
    setSocket: (socket) => set((state) => ({ ...state, socket })),
    setOnlineUsers: (users) => set((state) => ({ ...state, onlineUsers: users })),
    socketStatus: 'disconnected',
    setSocketStatus: (socketStatus) => set({ socketStatus }),
    // LOCATION
    position: null,
    setPosition: (position) => set({ position }),
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
          selectedConversation && selectedConversation.data._id !== message.sender._id;
        if (isInCommonChat && isCurrentConversation && !message.read) {
          return { ...message, read: true };
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
    addEmoji: ({ messageId, emoji }) => {
      const messages = get().messages;
      if (!Array.isArray(messages)) {
        console.error('Error: messages is not an array');
        return;
      }
      const updatedMessages = messages.map((message) => {
        if (message._id === messageId) {
          const existingEmoji = message.emoji.find(({ userId }) => userId === emoji.userId);

          if (existingEmoji) {
            // If the new emoji is not the same as the existing one, remove the old one and add the new one
            const newEmojis = message.emoji.map((e) => (e.userId === emoji.userId ? emoji : e));
            return { ...message, emoji: newEmojis };
          } else {
            // If the new emoji is not in the message yet, add it to the emojis array
            return { ...message, emoji: [...message.emoji, emoji] };
          }
        } else {
          return message;
        }
      });
      // Update the state with the new messages with new emoji
      set({ messages: updatedMessages });
    },
    deleteEmoji: ({ messageId, emoji }) => {
      const messages = get().messages;
      if (!Array.isArray(messages)) {
        console.error('Error: messages is not an array');
        return;
      }
      const updatedMessages = messages.map((message) => {
        const isCurrentMessage = message._id === messageId;

        const updatedEmoji = message.emoji.filter(
          ({ userId, value }) => !(userId === emoji.userId && value === emoji.value)
        );

        if (isCurrentMessage) {
          return { ...message, emoji: updatedEmoji };
        }
        return message;
      });
      // Update the state with the new messages
      set({ messages: updatedMessages });
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
    deleteNotification: (id) =>
      set((state) => state.notification.filter(({ newMessage }) => newMessage._id !== id)),
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
    pinnedGroups: JSON.parse(localStorage.getItem('pinnedGroups')) || [],
    setPinnedGroups: (groups) => set({ pinnedGroups: groups }),
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
