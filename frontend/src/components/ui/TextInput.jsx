const TextInput = ({ name, setName, style }) => {
  return (
    <input
      type='text'
      placeholder='Group name...'
      name='name'
      value={name}
      onChange={(e) => setName(e.target.value)}
      className={`input input-bordered w-64 ${
        style ? style : 'self-center'
      } h-9 rounded-lg bg-beige text-slate-900 placeholder:text-slate-600`}
    />
  );
};

export default TextInput;
