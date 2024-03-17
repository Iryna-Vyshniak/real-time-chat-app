import { emojiBook } from '../../../shared/data';
import useSendEmoji from '../../../shared/hooks/useSendEmoji';

const EmojiPopup = ({ onSelect, id }) => {
  const { sendEmoji } = useSendEmoji();
  return (
    <ul className='flex items-center justify-center flex-wrap w-64 p-2 bg-secondary rounded-md shadow-lg'>
      {emojiBook.map((emoji, idx) => (
        <li key={idx}>
          <button
            type='button'
            onClick={async () => {
              onSelect(id, emoji);
              await sendEmoji({
                messageId: id,
                emoji,
              });
            }}
          >
            {emoji}
          </button>
        </li>
      ))}
    </ul>
  );
};

export default EmojiPopup;
