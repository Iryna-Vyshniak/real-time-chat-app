import { useDeleteMessage } from '../../../shared/hooks/useDeleteMessage';
import Icon from '../../ui/Icon';

const DeleteMessage = ({ fromMe, id }) => {
  const { deleteMessage } = useDeleteMessage();
  return (
    <a
      href='#'
      role='button'
      disabled={!fromMe}
      onClick={() => deleteMessage({ id })}
      className={`flex items-center justify-start gap-2 text-slate-800 text-sm drop-shadow-2xl-white ${
        !fromMe && 'pointer-events-none text-slate-500/50'
      }`}
    >
      <Icon
        src='#icon-trash'
        style={`drop-shadow-2xl-white w-3 h-3 ${!fromMe && 'fill-slate-500/60'}`}
      />
      Delete
    </a>
  );
};

export default DeleteMessage;
