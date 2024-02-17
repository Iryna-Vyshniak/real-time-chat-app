import { NavLink } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className='flex justify-center items-center p-6 w-full rounded-lg shadow-md bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
      <div className='text-center text-slate-300 tracking-wider'>
        <h1 className='text-4xl font-medium'>404</h1>
        <p className='text-xl font-medium m-6'>
          Sorry, the page {"you're"} looking for {"can't"} be found
        </p>
        <NavLink
          to='/'
          className='bg-primary hover:bg-green text-white py-2 px-4 rounded drop-shadow-5xl-black'
        >
          Go Home
        </NavLink>
      </div>
    </div>
  );
};

export default NotFoundPage;
