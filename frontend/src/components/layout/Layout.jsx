import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Settings from '../shared/navbar/Settings';

const Layout = () => {
  return (
    <main className='h-screen overflow-hidden'>
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
