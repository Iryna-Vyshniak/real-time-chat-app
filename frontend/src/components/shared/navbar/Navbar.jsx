const Navbar = () => {
  return (
    <header className='fixed left-0 top-0 w-full min-h-[2rem] bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      <div className='container flex items-center justify-between'>
        <div className='flex-1 cursor-pointer'>
          <img src='/chat-logo.svg' alt='logo chat' width='44px' height='44px' />
        </div>
        <nav className='flex-none flex items-center justify-between gap-2'>
          <div className='navbar-end'>
            <button className='btn btn-ghost btn-circle'>
              <div className='indicator drop-shadow-[0px_1px_1px_rgba(250,250,250,1)]'>
                <svg
                  xmlns='http://www.w3.org/2000/svg'
                  className='h-6 w-6'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth='1'
                    d='M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                  />
                </svg>
                <span className='absolute top-0 right-0 flex items-center justify-center w-[16px] h-[16px] rounded-full bg-blue-500 indicator-item text-white text-[7px] drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
                  99
                </span>
              </div>
            </button>
          </div>
          <div className='dropdown dropdown-end'>
            <div tabIndex={0} role='button' className='btn btn-ghost btn-circle avatar online'>
              <div className='w-10 rounded-full'>
                <img
                  alt='user avatar'
                  src='https://res.cloudinary.com/dkqxaid79/image/upload/v1692265419/rewievs/Fletcher_lyecuy.png'
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className='mt-3 z-[2] p-2 shadow menu menu-sm dropdown-content rounded-box w-52 bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'
            >
              <li>
                <a className='justify-between text-slate-100 drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
                  Profile
                  <span className='badge'>New</span>
                </a>
              </li>
              <li>
                <button onClick={() => document.getElementById('settings').showModal()}>
                  <span className='text-slate-100 drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>
                    Settings
                  </span>
                </button>
              </li>
              <li>
                <a className='text-slate-100 drop-shadow-[0px_0.5px_0.5px_rgba(0,0,0,1)]'>Logout</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
