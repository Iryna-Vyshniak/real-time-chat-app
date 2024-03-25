const ImageDialog = ({ message: { _id, img } }) => {
  return (
    <dialog id={`${_id}`} className='modal'>
      <div className='modal-img modal-box'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-accent border-accent bg-white/55 drop-shadow-1xl-black'>
            ✕
          </button>
        </form>
        <img
          src={img}
          alt='message'
          width={128}
          height={80}
          className='w-full h-full rounded-2xl object-cover'
        />
      </div>
    </dialog>
  );
};

export default ImageDialog;
