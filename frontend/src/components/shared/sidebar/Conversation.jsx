import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';

import { useSocketContext } from '../../../shared/context/SocketContext.jsx';
import useConversation from '../../../store/useConversation.jsx';

import Avatar from '../../ui/Avatar';
import Divider from '../../ui/Divider.jsx';
import { useState } from 'react';

const Conversation = ({
  conversation: { _id, fullName, username, avatar },
  emoji,
  lastIdx,
  filteredNotification,
  toggleSidebar,
  filtered,
}) => {
  const [clicked, setClicked] = useState(false);
  const { ref, inView } = useInView();

  const {
    selectedConversation,
    setSelectedConversation,
    setNotification,
    notification,
    resetCurrentPage,
  } = useConversation();

  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(_id);

  const isSelected = selectedConversation?._id === _id;

  const handleClick = () => {
    // implementing click disabling for previously clicked items
    if (clicked) return;
    // resetting the current page
    resetCurrentPage();
    setSelectedConversation({ _id, fullName, username, avatar });
    setNotification(notification.filter(({ sender: { _id: idSender } }) => idSender !== _id));
    toggleSidebar();
    setClicked(true);
  };

  return (
    <>
      {filtered ? (
        <>
          {' '}
          <div
            className={`relative flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
              isSelected ? 'md:bg-secondary/30' : ''
            }`}
            onClick={handleClick}
          >
            <div className='relative'>
              <Link to={`/users/${_id}`} className='relative'>
                <Avatar src={avatar} selected={isSelected} isOnline={isOnline} />
              </Link>

              {filteredNotification.length > 0 && (
                <div className='absolute bottom-0 right-0 z-10 flex items-end justify-end md:hidden'>
                  <span className='flex items-center justify-center shadow bg-primary h-4 w-4 text-[10px] rounded-full text-slate-800'>
                    {filteredNotification[0].count}
                  </span>
                </div>
              )}
            </div>

            <div className='flex items-center justify-between gap-4 flex-grow'>
              <p className='font-semibold text-slate-300 tracking-wider drop-shadow-5xl-black'>
                {fullName}
              </p>
              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/20 shadow-md'>
                {filteredNotification.length > 0 ? (
                  <div className='absolute z-[10] flex items-center justify-center h-full right-0 top-0 mr-4'>
                    <span className='flex items-center justify-center shadow bg-primary h-6 w-6 text-xs rounded-full text-slate-800'>
                      {filteredNotification[0].count}
                    </span>
                  </div>
                ) : (
                  <span className='text-lg drop-shadow-lg'>{emoji}</span>
                )}
              </div>
            </div>
          </div>
          {!lastIdx && <Divider style='hidden md:flex' />}
        </>
      ) : (
        <motion.li
          viewport={{ amount: 0 }}
          style={{
            transform: inView ? 'scale(1)' : 'scale(0.5)',
            transitionProperty: 'transform',
            transitionDuration: '0.9s',
            transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
            transitionDelay: inView ? '0.9' : '0s',
          }}
          className='w-full'
          ref={ref}
        >
          <div
            className={`relative flex items-center justify-between gap-2 p-3 rounded-lg cursor-pointer transition duration-200 ease-in-out ${
              isSelected ? 'md:bg-secondary/30' : ''
            }`}
            onClick={handleClick}
          >
            <div className='relative'>
              <Avatar src={avatar} selected={isSelected} isOnline={isOnline} />

              {filteredNotification.length > 0 && (
                <div className='absolute bottom-0 right-0 z-10 flex items-end justify-end md:hidden'>
                  <span className='flex items-center justify-center shadow bg-primary h-4 w-4 text-[10px] rounded-full text-slate-800'>
                    {filteredNotification[0].count}
                  </span>
                </div>
              )}
            </div>

            <div className='flex items-center justify-between gap-4 flex-grow'>
              <p className='font-semibold text-slate-300 tracking-wider drop-shadow-5xl-black'>
                {fullName}
              </p>
              <div className='flex items-center justify-center w-8 h-8 rounded-full bg-slate-500/20 shadow-md'>
                {filteredNotification.length > 0 ? (
                  <div className='absolute z-[10] flex items-center justify-center h-full right-0 top-0 mr-4'>
                    <span className='flex items-center justify-center shadow bg-primary h-6 w-6 text-xs rounded-full text-slate-800'>
                      {filteredNotification[0].count}
                    </span>
                  </div>
                ) : (
                  <span className='text-lg drop-shadow-lg'>{emoji}</span>
                )}
              </div>
            </div>
          </div>
          {!lastIdx && <Divider style='hidden md:flex' />}
        </motion.li>
      )}
    </>
  );
};

export default Conversation;
