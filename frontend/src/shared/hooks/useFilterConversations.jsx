export const useFilterConversations = (conversations, selectedTalking) => {
  const filteredConversations = conversations.filter((conversation) =>
    conversation.fullName.toLowerCase().trim().includes(selectedTalking?.fullName.toLowerCase())
  );

  return filteredConversations;
};
