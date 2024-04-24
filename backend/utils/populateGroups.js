import Conversation from '../models/conversation.model.js';

export const populateGroups = async (groupIds) => {
  const populatedGroups = await Promise.all(
    groupIds.map(async (groupId) => {
      const group = await Conversation.findById(groupId).select(
        '_id chatName chatAvatar participants'
      );
      return group;
    })
  );
  return populatedGroups;
};
