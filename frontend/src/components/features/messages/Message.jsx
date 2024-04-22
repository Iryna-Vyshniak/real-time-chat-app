import { lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import parse from 'html-react-parser';

const ImageDialog = lazy(() => import('./message.data/image/ImageDialog'));

import { useAuthContext } from '../../../shared/context/AuthContext';
import { useRemoveEmoji } from '../../../shared/hooks/useRemoveEmoji';
import useConversation from '../../../store/useConversation';

import { extractTime, parseMessage } from '../../../shared/utils';

import DropdownMessage from './message.data/DropdownMessage';
import QuotedMessage from './message.data/reply/QuotedMessage';
import ImageMessage from './message.data/image/ImageMessage';
import DownloadImage from './message.data/image/DownloadImage';

import DropdownButton from '../../ui/DropdownButton';
import Icon from '../../ui/Icon';

import AudioPlayer from './message.data/audio/AudioPlayer';
import VideoPlayer from './message.data/video/VideoPlayer';

const Message = ({ message, onReply, quotedMessage }) => {
  const { authUser } = useAuthContext();

  const { selectedConversation, messages, onlineGroupUsers } = useConversation();

  const { removeEmoji } = useRemoveEmoji();

  // infinity scrolling - intersection-observer
  const { ref, inView } = useInView();

  // parse message if it has link
  const parsedMessage = parse(parseMessage(message.text));

  // find qouted message
  const quotedInfo = messages.find((message) => message._id === quotedMessage);

  // function to remove emoji -
  const onRemoveEmoji = async (id) => {
    await removeEmoji({ messageId: id });
  };

  const fromMe = message.sender._id === authUser._id;

  const chatClassName = fromMe ? 'chat-end' : 'chat-start';
  const chatColor = fromMe ? 'bg-beige/80' : 'bg-green/80';
  const dropdownColor = fromMe ? 'bg-green' : 'bg-beige';
  const avatar = fromMe
    ? authUser.avatar
    : selectedConversation?.type === 'private'
    ? selectedConversation?.data?.avatar
    : message.sender.avatar;

  const isMsgRead = message.read;

  // read or not
  const messageStatus =
    isMsgRead && fromMe ? (
      <Icon src='#icon-checkmark-read' style='w-4 h-4 drop-shadow-3xl-red' />
    ) : (
      <Icon src='#icon-checkmark-send' style='w-4 h-4 drop-shadow-3xl-black' />
    );
  const shakeClass = message.shouldShake ? 'shake-msg' : '';

  const isOnline = onlineGroupUsers?.onlineUsers?.some((user) => message.sender.fullName === user);

  let onlineStatus = '';
  let groupStatus = '';

  if (!fromMe) {
    onlineStatus = selectedConversation?.type === 'group' && (isOnline ? 'online' : 'offline');
    groupStatus = selectedConversation?.type === 'group' ? '-group' : '';
  }

  return (
    <motion.div
      key={message._id}
      ref={ref}
      style={{
        opacity: inView ? 1 : 0,
        transition: 'all 250ms linear 250ms',
      }}
    >
      <div className={`chat ${chatClassName} relative`}>
        {' '}
        <Link
          to={fromMe ? `/users/${authUser._id}` : `/users/${message.sender._id}`}
          className={`chat-image avatar cursor-pointer ${onlineStatus} ${onlineStatus}${groupStatus} `}
        >
          <div className='w-10 rounded-full shadow-lg shadow-primary/40 border-[1px] border-green'>
            <img alt='user avatar' src={avatar} width='40px' height='40px' />
          </div>
        </Link>
        <div
          className={`chat-bubble pb-2 text-slate-800 ${
            message.video ? 'bg-transparent' : chatColor
          } ${shakeClass} flex flex-col items-center justify-center gap-1 selection:bg-accent/50 cursor-pointer break-all`}
        >
          {quotedMessage && (
            <QuotedMessage
              message={quotedInfo || quotedMessage}
              dropdownColor={dropdownColor}
              fromMe={fromMe}
            />
          )}
          <DropdownButton id={message._id} fromMe={fromMe} button={true}>
            <DropdownMessage
              dropdownColor={dropdownColor}
              message={message}
              onReply={onReply}
              fromMe={fromMe}
            />
          </DropdownButton>
          {message.img && <DownloadImage message={message} />}
          <div className='flex flex-col items-center justify-between gap-2'>
            {message.img && <ImageMessage message={message} />}
            {message.audio && <AudioPlayer src={message.audio} />}
            {message.video && <VideoPlayer src={message.video} />}
            {parsedMessage}
          </div>
          {message.emoji && (
            <button
              onClick={() => onRemoveEmoji(message._id)}
              className={`absolute -bottom-2 ${fromMe ? 'left-1' : 'right-1'} bg-transparent`}
              disabled={fromMe}
            >
              {message.emoji}
            </button>
          )}
        </div>
        <div className='chat-footer flex items-center justify-center gap-2 text-xs text-slate-600'>
          {messageStatus} {extractTime(message.createdAt)}
        </div>
      </div>
      <ImageDialog message={message} />
    </motion.div>
  );
};

export default Message;
