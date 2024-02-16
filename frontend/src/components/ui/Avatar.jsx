const Avatar = ({ src, selected }) => {
  return (
    <div
      tabIndex={0}
      role='button'
      className={`btn btn-ghost btn-circle avatar shadow-xl shadow-primary/30 online ${
        selected ? 'ring ring-accent ring-offset-base-100 ring-offset-2' : ''
      }`}
    >
      <div className='w-10 rounded-full'>
        <img alt='user avatar' src={src} width='2.8rem' height='2.8rem' className='shadow-lg' />
      </div>
    </div>
  );
};

export default Avatar;
