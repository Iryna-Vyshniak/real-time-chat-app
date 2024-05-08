const ImageMessage = ({ message }) => {
  return (
    <>
      <div className='relative w-32 h-20 self-center'>
        <img
          src={message.img}
          alt='message'
          width={128}
          height={80}
          onClick={() => document.getElementById(`${message._id}`).showModal()}
          className='absolute z-0 w-full h-full object-contain cursor-pointer'
        />
      </div>
    </>
  );
};

export default ImageMessage;
