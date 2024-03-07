import { emojiBook } from '../data/index';

// generate random emoji
export const generateEmoji = () => {
  const emodjiList = emojiBook.length;

  const randomIdx = Math.floor(Math.random() * emodjiList);

  return emojiBook[randomIdx];
};

// for message time
export const extractTime = (dateStr) => {
  const date = new Date(dateStr);
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  return `${hours}:${minutes}`;
};

// pad single-digit numbers with a leading zero
function padZero(num) {
  return num.toString().padStart(2, '0');
}

//  for notification
export const uniqueSender = (notification) => {
  if (notification) {
    return Object.values(
      notification.reduce((acc, curr) => {
        const {
          sender: { _id, fullName, username, avatar },
        } = curr;

        if (!acc[_id]) {
          acc[_id] = {
            sender: { _id, fullName, username, avatar },
            count: 1,
          };
        } else {
          acc[_id].count += 1;
        }
        return acc;
      }, {})
    );
  } else {
    return null;
  }
};

// get conversationId

export const getUserConversationId = (messagesArr, _id) => {
  if (messagesArr.length > 0) {
    for (const message of messagesArr) {
      if (message.sender._id === _id || message.receiver._id === _id) {
        return message.conversationId;
      }
    }
  }
  return null;
};
