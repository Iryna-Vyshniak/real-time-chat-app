import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import Navbar from '../shared/navbar/Navbar';
import Settings from '../shared/navbar/Settings';

const Layout = () => {
  return (
    <div className='p-4 h-screen flex flex-col items-center justify-center overflow-hidden'>
      <Navbar />
      <main className='flex flex-col items-center justify-center'>
        <Suspense fallback={<p>...Loading</p>}>
          <Outlet />
        </Suspense>
        <Settings />
      </main>
    </div>
  );
};

export default Layout;
