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
        if (curr.newMessage && curr.newMessage.sender) {
          const {
            sender: { _id, fullName, username, avatar, gender, createdAt },
            receiver,
          } = curr.newMessage;

          if (!acc[_id]) {
            acc[_id] = {
              type: curr.type,
              sender: { _id, fullName, username, avatar, gender, createdAt },
              receiver,
              count: 1,
            };
          } else {
            acc[_id].count += 1;
          }
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
  for (const message of messagesArr) {
    if (message.sender._id === _id || message.receiver._id === _id) {
      return message.conversationId;
    }
  }
  return null;
};

//  A function that returns a date in the format "10 Mar 2024"

export const getFormattedDate = (date) => {
  const options = {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  };
  return new Date(date).toLocaleDateString('en-US', options);
};

// Check if the date has changed
export const hasDateChanged = (previousDate, currentDate) => {
  return previousDate !== currentDate;
};

// create link to download image from cloudinary
export const downloadImage = (url) => {
  return `${url.split('/upload/')[0]}/upload/fl_attachment/${url.split('/upload/')[1]}`;
};
