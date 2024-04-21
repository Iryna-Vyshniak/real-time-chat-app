import { useState } from 'react';
import toast from 'react-hot-toast';

import useConversation from '../../../../store/useConversation';
import { useCreateGroupChat } from '../../../../shared/hooks/useCreateGroupChat';

import Icon from '../../../ui/Icon';
import Divider from '../../../ui/Divider';
import Button from '../../../ui/Button';
import SearchInput from '../../../ui/SearchInput';
import TextInput from '../../../ui/TextInput';

import FoundUsersList from '../user.data/FoundUsersList';
import SelectedUsersList from '../user.data/SelectedUsersList';

const GroupChatModal = () => {
  const [groupChatName, setGroupChatName] = useState('');
  const [search, setSearch] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const { conversations } = useConversation();
  const { createGroupChat } = useCreateGroupChat();

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search) return;
    if (search.length < 3) {
      return toast.error('Search term must be at least 3 characters long');
    }

    const searchConversation = conversations.filter((conversation) =>
      conversation.fullName.toLowerCase().includes(search.toLowerCase().trim())
    );

    if (!searchConversation) {
      return toast.error('Not found user');
    }

    if (searchConversation) {
      setFoundUsers(searchConversation);
      setSearch('');
    }
  };

  const handleAddToGroup = (userToAdd) => {
    if (selectedUsers.includes(userToAdd)) {
      return toast.error('User already added');
    }

    const updatedUsers = [...selectedUsers, userToAdd];
    setSelectedUsers(updatedUsers);
  };

  const handleDelete = (deleteUser) =>
    setSelectedUsers(selectedUsers.filter((user) => user._id !== deleteUser._id));

  const handleSubmit = async () => {
    if (!groupChatName || selectedUsers.length === 0) return;
    await createGroupChat({ chatname: groupChatName, users: selectedUsers });
    setFoundUsers([]);
    setSelectedUsers([]);
    setGroupChatName('');
  };

  return (
    <>
      <Button
        onClick={() => document.getElementById('group-chat').showModal()}
        width='w-[10rem] self-center'
      >
        <Icon src='#icon-group_add' style='w-[18px] h-[18px] fill-white' />
        <span>New Group</span>
      </Button>
      <Divider />
      <dialog id='group-chat' className='modal sm:modal-middle'>
        <div className='modal-box'>
          <form
            method='dialog'
            className='flex flex-col items-center gap-2 text-slate-800'
            onSubmit={() => {
              if (groupChatName || selectedUsers.length > 0) {
                handleSubmit();
              }
            }}
          >
            <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white/50'>
              ✕
            </button>

            <h1 className='font-bold text-lg text-slate-100 drop-shadow-2xl-double tracking-wider'>
              Create Group Chat
            </h1>
            <TextInput name={groupChatName} setName={setGroupChatName} />
            <SearchInput handleSearch={handleSearch} search={search} setSearch={setSearch} />
            {selectedUsers.length > 0 && (
              <>
                {' '}
                <SelectedUsersList selectedUsers={selectedUsers} handleDelete={handleDelete} />
                <Divider />
              </>
            )}
            <FoundUsersList foundUsers={foundUsers} handleGroup={handleAddToGroup} />

            <Button type='submit' width='w-64 self-center'>
              Create Group
            </Button>
          </form>
        </div>
      </dialog>
    </>
  );
};

export default GroupChatModal;
