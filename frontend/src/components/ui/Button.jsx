const Button = ({ children, style }, props) => {
  return (
    <button
      className={`${
        style
          ? 'btn-sm btn-circle rounded-full h-9 min-h-9 w-9'
          : 'mt-2 btn-block h-10 min-h-10 rounded-lg'
      } btn btn-md bg-blue-600 text-white text-sm font-medium uppercase  shadow-md hover:bg-blue-700 transition duration-200 ease-in-out hover:shadow-lg active:bg-blue-800`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
