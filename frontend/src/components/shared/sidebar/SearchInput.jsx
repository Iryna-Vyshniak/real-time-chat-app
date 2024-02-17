import { useState } from 'react';
import toast from 'react-hot-toast';

import Button from '../../ui/Button';
import Icon from '../../ui/Icon';

import useConversation from '../../../store/useConversation';
import { useGetConversations } from '../../../shared/hooks/useGetConversations';
import useUpdateStatusMsg from '../../../shared/hooks/useUpdateStatusMsg';

const SearchInput = () => {
  const [search, setSearch] = useState('');
  const { setSelectedConversation, setLastMessages } = useConversation();
  const { conversations, lastMessages } = useGetConversations();
  const { updateStatusMessage } = useUpdateStatusMsg();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error('Search term must be at least 3 characters long');
    }

    const searchConversation = conversations.find((conversation) =>
      conversation.fullName.toLowerCase().includes(search.toLowerCase().trim())
    );

    if (!searchConversation) {
      return toast.error('Not found user');
    }

    if (searchConversation) {
      setSelectedConversation(searchConversation);
      await updateStatusMessage(searchConversation._id);
      const updatedLastMessages = lastMessages.map((item) => {
        if (item._id === searchConversation._id) {
          return {
            ...item,
            lastMessage: {
              ...item.lastMessage,
              read: true,
            },
          };
        }
        return item;
      });
      setLastMessages(updatedLastMessages);
      setSearch('');
    }
  };

  return (
    <form
      className='flex items-center justify-center gap-2'
      onSubmit={handleSubmit}
      autoComplete='off'
    >
      <input
        type='search'
        placeholder='Search...'
        name='search'
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className='input input-bordered h-9 rounded-full bg-beige text-slate-900 placeholder:text-slate-600'
      />
      <Button type='submit' style='btn-circle'>
        <Icon
          src='#icon-search'
          style='w-[18px] h-[18px] drop-shadow-[0px_1px_0.5px_rgba(0,0,0,1)]'
        />
      </Button>
    </form>
  );
};

export default SearchInput;
