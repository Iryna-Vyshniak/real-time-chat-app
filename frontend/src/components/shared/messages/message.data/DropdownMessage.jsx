import EmojiPopup from './emojii/EmojiPopup';
import DeleteMessage from './DeleteMessage';
import EditMessage from './EditMessage';
import ReplyMessage from './ReplyMessage';

const DropdownMessage = ({ dropdownColor, message, onReply, fromMe }) => {
  return (
    <menu
      tabIndex={0}
      className={`
                ${dropdownColor} 
                dropdown-content menu mt-2 p-2 shadow rounded-box w-24 gap-2 z-[50]`}
    >
      <ReplyMessage message={message} onReply={onReply} />
      <EditMessage id={message._id} text={message.text} fromMe={fromMe} />
      <DeleteMessage id={message._id} fromMe={fromMe} />
      <EmojiPopup id={message._id} fromMe={fromMe} />
    </menu>
  );
};

export default DropdownMessage;
