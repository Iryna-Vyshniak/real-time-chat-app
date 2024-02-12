const Avatar = ({ src }) => {
  return (
    <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar online'>
      <div className='w-10 rounded-full'>
        <img alt='user avatar' src={src} width='2.8rem' height='2.8rem' />
      </div>
    </div>
  );
};

export default Avatar;