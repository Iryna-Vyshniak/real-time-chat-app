import MessagesBlock from '../../components/shared/messages/MessagesBlock';
import Sidebar from '../../components/shared/sidebar/Sidebar';

const HomePage = () => {
  return (
    <div className='home relative flex flex-col md:flex-row gap-2 max-w-full md:w-4/5 xl:w-3/5 rounded-lg bg-slate-300/10 brightness-105 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-1 text-slate-300'>
      <Sidebar />
      <MessagesBlock />
    </div>
  );
};

export default HomePage;
