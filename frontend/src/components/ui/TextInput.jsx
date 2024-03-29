const TextInput = ({ name, setName }) => {
  return (
    <input
      type='text'
      placeholder='Group name...'
      name='name'
      value={name}
      onChange={(e) => setName(e.target.value)}
      className='input input-bordered w-64 self-center h-9 rounded-lg bg-beige text-slate-900 placeholder:text-slate-600'
    />
  );
};

export default TextInput;
