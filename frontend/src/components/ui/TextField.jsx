const TextField = ({ label, id, variant, ...props }) => {
  return (
    <>
      {label && (
        <label htmlFor={id} className='label p-2 mt-2'>
          <span className={`text-base label-text text-slate-300 drop-shadow-5xl-black ${variant}`}>
            {label}
          </span>
        </label>
      )}
      <input id={id} className='w-full input input-bordered h-10 bg-secondary/30' {...props} />
    </>
  );
};

export default TextField;
