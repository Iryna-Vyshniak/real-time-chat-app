import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../shared/navbar/Navbar';
import Settings from '../shared/navbar/Settings';

const Layout = () => {
  return (
    <div className='flex flex-col justify-center h-screen overflow-hidden'>
      <Navbar />
      <main className='relative flex-1 flex items-center justify-center mt-[5.5rem]'>
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
    </div>
  );
};

export default Layout;
