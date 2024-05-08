import { useEffect, useState } from 'react';

import { countEmojis } from '../../../../../shared/utils';

const EmojiList = ({ emoji, _id, fromMe, onRemoveEmoji }) => {
  const [emojiCounts, setEmojiCounts] = useState({});


  useEffect(() => {
    setEmojiCounts(countEmojis(emoji));
  }, [emoji]);

  return (
    <ul className={`flex -space-x-[4px]`}>
      {Object.entries(emojiCounts).map(([emojiValue, count], idx) => (
        <li key={idx}>
          {' '}
          <button
            onClick={() => {
              onRemoveEmoji(_id, emojiValue);
            }}
            disabled={fromMe}
            className='flex items-center justify-center gap-1'
          >
            {emojiValue}{' '}
            <span className='text-xs text-[#2d4b069b]'>{count === 1 ? null : count}</span>
          </button>
        </li>
      ))}
    </ul>
  );
};

export default EmojiList;
