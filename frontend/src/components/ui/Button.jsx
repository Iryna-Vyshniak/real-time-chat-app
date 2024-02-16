const Button = ({ children, style }, props) => {
  return (
    <button
      className={`${
        style
          ? 'btn-sm btn-circle rounded-full h-9 min-h-9 w-9'
          : 'mt-2 btn-block h-10 min-h-10 rounded-lg'
      } btn btn-md bg-primary text-slate-800 text-sm font-medium uppercase tracking-widest shadow-md hover:bg-green transition duration-200 ease-in-out hover:shadow-lg active:bg-green`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
