import EmojiPopup from '../emojii/EmojiPopup';
import DeleteMessage from './DeleteMessage';
import ReplyMessage from './ReplyMessage';

const DropdownMessage = ({ dropdownColor, message, onReply, fromMe }) => {
  return (
    <menu
      tabIndex={0}
      className={`
                ${dropdownColor} 
                dropdown-content z-[50] menu mt-2 p-2 shadow rounded-box w-24 gap-2`}
    >
      <ReplyMessage message={message} onReply={onReply} />
      <DeleteMessage />
      <EmojiPopup id={message._id} fromMe={fromMe} />
    </menu>
  );
};

export default DropdownMessage;
