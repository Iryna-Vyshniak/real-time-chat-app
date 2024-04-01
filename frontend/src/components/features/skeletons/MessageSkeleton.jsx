const MessageSkeleton = () => {
  return (
    <>
      <div className='flex gap-3 items-center'>
        <div className='skeleton bg-primary/50 w-10 h-10 rounded-full shrink-0'></div>
        <div className='flex flex-col gap-1'>
          <div className='skeleton bg-primary/50 h-5 w-40'></div>
          <div className='skeleton bg-primary/50 h-5 w-48'></div>
        </div>
      </div>
      <div className='flex gap-3 items-center justify-end'>
        <div className='flex flex-col gap-1'>
          <div className='skeleton bg-primary/50 h-5 w-40'></div>
        </div>
        <div className='skeleton bg-primary/50 w-10 h-10 rounded-full shrink-0'></div>
      </div>
    </>
  );
};
export default MessageSkeleton;
