import { useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../../store/useConversation';
import SearchInput from '../../ui/SearchInput';

const ConversationSearch = () => {
  const [search, setSearch] = useState('');
  const { setSelectedConversation, conversations } = useConversation();

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
      setSearch('');
    }
  };

  return (
    <SearchInput handleSearch={handleSubmit} search={search} setSearch={setSearch} hasForm={true} />
  );
};

export default ConversationSearch;
