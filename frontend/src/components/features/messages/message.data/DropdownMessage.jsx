import EmojiPopup from './emojii/EmojiPopup';
import DeleteMessage from './delete/DeleteMessage';
import EditMessage from './edit/EditMessage';
import ReplyMessage from './reply/ReplyMessage';

const DropdownMessage = ({ dropdownColor, message, onReply, fromMe }) => {
  return (
    <menu
      tabIndex={0}
      className={`
                ${dropdownColor} 
                menu menu-xs dropdown-content z-[50] glass mt-2 p-2 shadow rounded-box w-24`}
    >
      <ReplyMessage message={message} onReply={onReply} />
      <EditMessage id={message._id} text={message.text} fromMe={fromMe} />
      <DeleteMessage id={message._id} fromMe={fromMe} />
      <EmojiPopup id={message._id} fromMe={fromMe} />
    </menu>
  );
};

export default DropdownMessage;
