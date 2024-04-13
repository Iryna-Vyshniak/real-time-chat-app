import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import isEqual from 'lodash.isequal';

import useConversation from '../../../../store/useConversation';

import UserFullInfo from '../../sidebar/user.data/UserFullInfo';
import GroupFullInfo from './GroupFullInfo';
import { useEditGroup } from '../../../../shared/hooks/useEditGroup';
import { usePreviewImage } from '../../../../shared/hooks/usePreviewImage';

const ChatInfoModal = ({ data, type }) => {
  const [groupChatName, setGroupChatName] = useState(data.chatName);
  const [search, setSearch] = useState('');
  const [foundUsers, setFoundUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState(data.participants);
  const [isChanged, setIsChanged] = useState(false);

  const {
    conversations,
    initialGroupChatName,
    setInitialGroupChatName,
    initialSelectedUsers,
    setInitialSelectedUsers,
    initialImgUrl,
    setInitialImgUrl,
  } = useConversation();
  const { imgUrl, setImgUrl, handleImageChange } = usePreviewImage();
  const { editGroup } = useEditGroup();

  useEffect(() => {
    setGroupChatName(data.chatName);
    setSelectedUsers(data.participants);
  }, [data.chatName, data.participants]);

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
    const isExistUser = selectedUsers.some((user) => user._id === userToAdd._id);
    if (isExistUser) {
      return toast.error('User already added');
    } else {
      const updatedUsers = [...selectedUsers, userToAdd];
      setSelectedUsers(updatedUsers);
    }
  };

  const handleDelete = (deleteUser) => {
    setSelectedUsers(selectedUsers.filter((user) => user._id !== deleteUser._id));
  };

  useEffect(() => {
    if (
      groupChatName !== initialGroupChatName ||
      (imgUrl && imgUrl !== initialImgUrl) ||
      // selectedUsers and initialSelectedUsers are arrays of objects, we use a deep comparison of their contents, not just checking if they are the same object. Use a library like lodash for deep object comparison.
      !isEqual(selectedUsers, initialSelectedUsers)
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  }, [
    groupChatName,
    imgUrl,
    initialGroupChatName,
    initialImgUrl,
    initialSelectedUsers,
    selectedUsers,
  ]);

  const handleSubmit = async () => {
    // Check if at least one field has changed
    if (isChanged) {
      await editGroup({ chatname: groupChatName, users: selectedUsers, chatAvatar: imgUrl });
      setImgUrl(null);
      // Update the initial values
      setInitialGroupChatName(groupChatName);
      setInitialSelectedUsers(selectedUsers);
      setInitialImgUrl(imgUrl);
    }
  };

  return (
    <dialog id='chat-info' className='modal sm:modal-middle'>
      <div className='modal-box'>
        <form
          method='dialog'
          className='flex flex-col items-center gap-2 text-slate-800'
          onSubmit={() => {
            if (type === 'group') {
              handleSubmit();
            }
          }}
        >
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>✕</button>
          {type === 'private' ? (
            <UserFullInfo user={data} />
          ) : (
            <GroupFullInfo
              data={data}
              imgUrl={imgUrl}
              handleImageChange={handleImageChange}
              groupChatName={groupChatName}
              setGroupChatName={setGroupChatName}
              search={search}
              setSearch={setSearch}
              foundUsers={foundUsers}
              selectedUsers={selectedUsers}
              handleDelete={handleDelete}
              handleAddToGroup={handleAddToGroup}
              handleSearch={handleSearch}
            />
          )}
        </form>
      </div>
    </dialog>
  );
};

export default ChatInfoModal;
