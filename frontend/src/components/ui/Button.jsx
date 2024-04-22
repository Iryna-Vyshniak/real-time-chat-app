const Button = ({ children, style, onClick, width, disabled }, props) => {
  return (
    <button
      onClick={onClick}
      className={`btn bg-primary text-slate-800 text-sm font-medium uppercase tracking-widest shadow-md hover:bg-green transition duration-200 ease-in-out hover:shadow-lg active:bg-green ${
        style ? style : `mt-2 btn-block h-10 min-h-10 rounded-lg ${width}`
      } 
      ${disabled && 'bg-gray-600 cursor-not-allowed text-slate-500/50'}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
