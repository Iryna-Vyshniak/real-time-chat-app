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
