import MessagesBlock from '../../components/shared/messages/MessagesBlock';
import Sidebar from '../../components/shared/sidebar/Sidebar';
import Navbar from '../../components/shared/navbar/Navbar';

import { useEffect, useState } from 'react';

const HomePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

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
      <Sidebar isMobile={isMobile} isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      <MessagesBlock isOpen={!isMobile || (isMobile && !isSidebarOpen)} />
    </div>
  );
};

export default HomePage;
