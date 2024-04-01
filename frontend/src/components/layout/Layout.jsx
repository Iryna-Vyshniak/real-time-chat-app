import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Settings from '../features/navbar/Settings';

const Layout = () => {
  return (
    <main className='flex flex-col items-center justify-center h-[100dvh] max-w-full overflow-hidden text-slate-800'>
      {' '}
      <Suspense
        fallback={
          <div className='flex items-center justify-center'>
            <span className='loading loading-ring loading-lg'></span>
          </div>
        }
      >
        <Outlet />
      </Suspense>
      <Settings />
    </main>
  );
};

export default Layout;
