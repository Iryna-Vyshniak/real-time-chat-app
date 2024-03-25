import { emojiBook } from '../../../../../shared/data';

import useEmojiPicker from '../../../../../shared/hooks/useEmojiPicker';
import useSendEmoji from '../../../../../shared/hooks/useSendEmoji';

import Icon from '../../../../ui/Icon';

const EmojiPopup = ({ id, fromMe }) => {
  const { sendEmoji } = useSendEmoji();
  const { currentPopupId, showEmojiPicker, emojiPickerRef, openEmojiPicker, onEmojiClick } =
    useEmojiPicker();

  return (
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
          className={`absolute z-[60] ${fromMe ? 'right-10' : 'left-10'} -bottom-10`}
        >
          <ul className='flex items-center justify-center flex-wrap w-64 h-40 p-2 rounded-md shadow-lg overflow-auto scroll-auto touch-auto will-change-scroll bg-primary/70 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-md'>
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
  );
};

export default EmojiPopup;
