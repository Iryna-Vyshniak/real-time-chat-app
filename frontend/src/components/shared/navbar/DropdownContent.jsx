import Logout from './Logout';

const DropdownContent = () => {
  return (
    <ul
      tabIndex={0}
      className='menu menu-sm dropdown-content mt-2 p-2 rounded-box w-52 shadow-md bg-primary'
    >
      <li>
        <a className='justify-between text-slate-800 font-semibold tracking-widest'>
          Profile
          <span className='badge'>New</span>
        </a>
      </li>
      <li>
        <button onClick={() => document.getElementById('settings').showModal()}>
          <span className='text-slate-800 font-semibold tracking-widest'>Settings</span>
        </button>
      </li>
      <li>
        <Logout />
      </li>
    </ul>
  );
};

export default DropdownContent;
