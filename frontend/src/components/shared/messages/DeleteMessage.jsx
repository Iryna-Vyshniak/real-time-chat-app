import Icon from '../../ui/Icon';

const DeleteMessage = () => {
  return (
    <a
      href='#'
      role='button'
      disabled
      className='flex items-center justify-start gap-2 text-slate-800 text-sm'
    >
      <Icon src='#icon-trash' style={`drop-shadow-1xl-black w-3 h-3`} />
      Delete
    </a>
  );
};

export default DeleteMessage;
