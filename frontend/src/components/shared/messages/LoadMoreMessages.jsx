import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

import { useGetMessages } from '../../../shared/hooks/useGetMessages';
import useConversation from '../../../store/useConversation';
import MessageSkeleton from '../skeletons/MessageSkeleton';

const LoadMoreMessages = () => {
  const { setCurrentPage, currentPage, totalPages, messages } = useConversation();
  const { isLoading } = useGetMessages();
  const { ref, inView: lastMessageInView } = useInView();

  // Use `useCallback` so we don't recreate the function on each render
  const setRefs = useCallback(
    (node) => {
      // Ref's from useRef needs to have the node assigned to `current`
      ref.current = node;
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      ref(node);
    },
    [ref]
  );

  useEffect(() => {
    if (!isLoading && messages.length > 0 && lastMessageInView && currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [lastMessageInView]);

  return (
    <>
      {!isLoading ? (
        <div
          ref={setRefs}
          className='text-sm text-center p-2 pt-4 text-slate-200 drop-shadow-1xl-black'
        >{`${new Date().toUTCString().split('GMT').toString().replace(/,\s*$/, '').trim()}`}</div>
      ) : (
        [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)
      )}
    </>
  );
};

export default LoadMoreMessages;
