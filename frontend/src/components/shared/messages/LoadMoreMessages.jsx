import { useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import toast from 'react-hot-toast';

import useConversation from '../../../store/useConversation';

const LoadMoreMessages = () => {
  const { setCurrentPage, currentPage, totalPages, isLoading } = useConversation();
  const { ref, inView: lastMessageInView } = useInView();

  // Use `useCallback` so we don't recreate the function on each render
  const setRefs = useCallback(
    (node) => {
      // Ref's from useRef needs to have the node assigned to `current`
      ref.current = node;
      ref(node);
    },
    [ref]
  );

  useEffect(() => {
    const loadMoreMessages = async () => {
      try {
        if (lastMessageInView && currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
        }
      } catch (error) {
        toast.error('Error loading more messages:', error);
      }
    };

    loadMoreMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastMessageInView]);

  return (
    <>
      {!isLoading ? (
        <div
          ref={setRefs}
          className='text-sm text-center p-2 pt-4 text-slate-200 drop-shadow-1xl-black'
        ></div>
      ) : null}
    </>
  );
};

export default LoadMoreMessages;
