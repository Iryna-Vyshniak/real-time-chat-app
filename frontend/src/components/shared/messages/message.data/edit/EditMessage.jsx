import useConversation from '../../../../../store/useConversation';
import Icon from '../../../../ui/Icon';

const EditMessage = ({ fromMe, id, text }) => {
  const { setSelectedMessage } = useConversation();
  return (
    <li>
      <a
        href='#'
        role='button'
        onClick={() => {
          if (text && fromMe) {
            setSelectedMessage(id, text);
          }
        }}
        className={`flex items-center justify-start gap-2 text-sm drop-shadow-2xl-white ${
          !fromMe || (fromMe && !text) ? 'pointer-events-none text-slate-500/50' : 'text-slate-800'
        }`}
      >
        <Icon
          src='#icon-pencil'
          style={`w-3 h-3 drop-shadow-2xl-black ${
            !fromMe || (fromMe && !text) ? 'fill-slate-400/60' : 'fill-slate-800'
          }`}
        />
        Edit
      </a>
    </li>
  );
};

export default EditMessage;
