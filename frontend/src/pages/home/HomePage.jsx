import { lazy, useEffect, useState } from 'react';

import { useGetMessages } from '../../shared/hooks/useGetMessages';

const MessagesBlock = lazy(() => import('../../components/shared/messages/MessagesBlock'));
const Sidebar = lazy(() => import('../../components/shared/sidebar/Sidebar'));
const Navbar = lazy(() => import('../../components/shared/navbar/Navbar'));

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useGetMessages();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className='absolute inset-0 flex flex-col-reverse md:flex-row w-screen overflow-auto text-slate-300'>
      <Navbar toggleSidebar={toggleSidebar} />
      {(isSidebarOpen || !isMobile) && (
        <Sidebar isMobile={isMobile} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      )}
      <MessagesBlock isOpen={!isMobile || (isMobile && !isSidebarOpen)} />
    </div>
  );
};

export default HomePage;
