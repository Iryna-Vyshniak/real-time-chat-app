const Title = ({ text, span }) => {
  return (
    <h1 className='text-3xl font-semibold tracking-wider text-center text-slate-300 drop-shadow-5xl-black'>
      {text} {span && <span className='text-primary'>{span}</span>}
    </h1>
  );
};

export default Title;
