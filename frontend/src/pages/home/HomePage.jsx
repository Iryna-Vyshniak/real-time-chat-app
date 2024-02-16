import MessagesBlock from '../../components/shared/messages/MessagesBlock';
import Sidebar from '../../components/shared/sidebar/Sidebar';

const HomePage = () => {
  return (
    <div className='relative -z-0 flex flex-col md:flex-row gap-2 md:w-4/5 max-w-full h-[70vh] rounded-lg overflow-hidden bg-green/20 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 text-slate-300'>
      <Sidebar />
      <MessagesBlock />
    </div>
  );
};

export default HomePage;
