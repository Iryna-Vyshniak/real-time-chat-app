export const useFilterConversations = (conversations, selectedTalking, type) => {
  if (type === 'private') {
    const filteredConversations = conversations.filter(
      (conversation) =>
        selectedTalking &&
        selectedTalking.fullName &&
        conversation.fullName.toLowerCase().trim().includes(selectedTalking.fullName.toLowerCase())
    );
    return filteredConversations;
  } else {
    return [];
  }
};
