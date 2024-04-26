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
          const { sender, receiver } = curr.newMessage;

          if (!acc[sender._id]) {
            acc[sender._id] = {
              type: curr.newMessage.onModel === 'User' ? 'private' : 'group',
              sender,
              receiver,
              count: 1,
            };
          } else {
            acc[sender._id].count += 1;
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

// replaces the URL with a hyperlink
export const parseMessage = (message) => {
  const urlPattern = /\b(https?:\/\/\S+)/gim;
  if (urlPattern.test(message)) {
    const parsedMessage = message.replace(
      urlPattern,
      '<a href="$1" target="_blank" className="text-blue-700 hover:underline  hover:underline-offset-4 hover:text-blue-800 transition duration-200 ease-in-out">Link</a>'
    );
    return parsedMessage;
  } else {
    return message;
  }
};

// Shorten long titles to 6 characters
export const getTitle = (title) => {
  if (title.length > 6) {
    return title.substring(0, 6) + '...';
  } else {
    return title;
  }
};
