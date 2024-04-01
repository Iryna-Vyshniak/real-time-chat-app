import { emojiBook } from '../../../../../shared/data';

import useEmojiPicker from '../../../../../shared/hooks/useEmojiPicker';
import useSendEmoji from '../../../../../shared/hooks/useSendEmoji';

import Icon from '../../../../ui/Icon';

const EmojiPopup = ({ id, fromMe }) => {
  const { sendEmoji } = useSendEmoji();
  const { currentPopupId, showEmojiPicker, emojiPickerRef, openEmojiPicker, onEmojiClick } =
    useEmojiPicker();

  return (
    <li>
      <a
        href='#'
        role='button'
        className={`flex items-center justify-start gap-2 text-sm drop-shadow-2xl-white cursor-pointer ${
          fromMe ? 'pointer-events-none text-slate-500/50' : 'text-slate-800'
        }`}
        onClick={() => openEmojiPicker(id)}
      >
        <Icon
          src='#icon-smile'
          style={`${fromMe ? 'fill-slate-500/60' : 'fill-slate-800'} drop-shadow-2xl-white w-4 h-4`}
        />
        Emoji
        {showEmojiPicker && currentPopupId === id && (
          <div
            ref={emojiPickerRef}
            className={`absolute z-[60] ${
              fromMe ? 'md:right-10' : '-left-[8rem] md:left-10'
            } bottom-1`}
          >
            <ul className='flex items-center justify-center flex-wrap gap-2 w-52 md:w-64 h-40 p-2 rounded-md shadow-lg overflow-auto scroll-smooth touch-auto will-change-scroll bg-primary'>
              {emojiBook.map((emoji, idx) => (
                <li key={idx}>
                  <button
                    type='button'
                    onClick={async (e) => {
                      e.preventDefault();
                      await sendEmoji({
                        messageId: id,
                        emoji,
                      });
                      onEmojiClick();
                    }}
                  >
                    {emoji}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </a>
    </li>
  );
};

export default EmojiPopup;
