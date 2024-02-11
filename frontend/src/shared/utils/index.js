import { emojiBook } from '../../data';

export const genEmoji = () => {
  const emodjiList = emojiBook.length;

  const randomIdx = Math.floor(Math.random() * emodjiList);

  return emojiBook[randomIdx];
};
