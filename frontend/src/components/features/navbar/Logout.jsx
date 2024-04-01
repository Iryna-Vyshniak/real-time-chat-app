import { useLogout } from '../../../shared/hooks/useLogout';

const Logout = () => {
  const { isLoading, logout } = useLogout();

  return (
    <>
      {!isLoading ? (
        <button onClick={logout} className='text-slate-800 font-semibold tracking-widest'>
          Logout
        </button>
      ) : (
        <span className='loading loading-spinner'></span>
      )}
    </>
  );
};

export default Logout;
