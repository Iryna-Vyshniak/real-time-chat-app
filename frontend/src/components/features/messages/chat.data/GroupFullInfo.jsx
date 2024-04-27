import { useRef, useState } from 'react';

import { useAuthContext } from '../../../../shared/context/AuthContext';

import AvatarGroup from '../../../ui/AvatarGroup';
import Button from '../../../ui/Button';
import Icon from '../../../ui/Icon';
import TextInput from '../../../ui/TextInput';
import SearchInput from '../../../ui/SearchInput';
import Divider from '../../../ui/Divider';

import SelectedUsersList from '../../sidebar/user.data/SelectedUsersList';
import FoundUsersList from '../../sidebar/user.data/FoundUsersList';

const GroupFullInfo = ({
  data,
  imgUrl,
  handleImageChange,
  groupChatName,
  setGroupChatName,
  search,
  setSearch,
  foundUsers,
  selectedUsers,
  handleDelete,
  handleSearch,
  handleAddToGroup,
  isChanged,
  setAction,
}) => {
  const [isShowInputRename, setIsShowInputRename] = useState(false);
  const [isAddMembers, setIsAddMembers] = useState(false);

  const fileRef = useRef();

  const toggleShowInputRename = () => {
    setIsShowInputRename(!isShowInputRename);
  };

  const toggleAddMembers = () => setIsAddMembers(!isAddMembers);

  const { authUser } = useAuthContext();

  const adminName = data.participants?.find(
    (participant) => participant._id === data.groupAdmin._id
  );

  const isAdmin = adminName?.fullName === authUser.fullName;

  const avatars = selectedUsers ? selectedUsers.map((participant) => participant) : [];

  const handleCloseAll = () => {
    setIsShowInputRename(false);
    setIsAddMembers(false);
  };

  return (
    <>
      <div className='relative w-40 md:w-60 h-40 md:h-60'>
        <img
          alt='user avatar'
          src={imgUrl || data.chatAvatar}
          width='6rem'
          height='6rem'
          className='w-40 md:w-60 h-40 md:h-60 rounded-full'
        />
        {isAdmin && (
          <div className='absolute bottom-[7%] right-0 md:right-2 z-50 w-8 h-8 rounded-full'>
            <button
              type='button'
              onClick={() => fileRef.current.click()}
              className='flex items-center justify-center rounded-full w-8 h-8 bg-primary text-slate-800 shadow-md hover:bg-green transition duration-200 ease-in-out hover:shadow-lg active:bg-green'
            >
              <Icon src='#icon-add' />
            </button>
            <input type='file' hidden ref={fileRef} onChange={handleImageChange} />
          </div>
        )}
      </div>
      <p className='my-4 self-start'>Admin: {adminName?.fullName}</p>
      <div className='self-start w-full'>
        <div
          className={`grid ${
            isAdmin && 'grid-cols-[3fr,0.5fr] items-center justify-center'
          }  w-full gap-2`}
        >
          {' '}
          <p>Group name: {groupChatName || data.chatName}</p>
          {isAdmin && (
            <button
              type='button'
              className='btn btn-ghost btn-circle cursor-pointer bg-transparent hover:bg-transparent btn-sm transition duration-200 ease-in-out'
              onClick={toggleShowInputRename}
            >
              <Icon src='#icon-pencil' style='w-4 h-4 fill-primary' />
            </button>
          )}
        </div>
        {isShowInputRename && (
          <TextInput name={groupChatName} setName={setGroupChatName} style='self-start' />
        )}
        <div className={`grid ${isAdmin && 'grid-cols-[3fr,0.5fr]'} items-center w-full gap-2`}>
          <div className='flex items-center gap-2'>
            Members: <AvatarGroup avatars={avatars} style='gap-2' />
          </div>
          {isAdmin && (
            <button
              type='button'
              className='btn btn-ghost btn-circle cursor-pointer bg-transparent hover:bg-transparent btn-sm transition duration-200 ease-in-out'
              onClick={toggleAddMembers}
            >
              <Icon src='#icon-group_add' style='w-6 h-6 fill-primary' />
            </button>
          )}
        </div>
        {isAddMembers && (
          <>
            <SearchInput handleSearch={handleSearch} search={search} setSearch={setSearch} />
            {selectedUsers.length > 0 && (
              <>
                {' '}
                <SelectedUsersList
                  selectedUsers={selectedUsers}
                  handleDelete={handleDelete}
                  adminName={adminName}
                  style='justify-start mt-2'
                />
                <Divider />
              </>
            )}

            <FoundUsersList foundUsers={foundUsers} handleGroup={handleAddToGroup} />
          </>
        )}

        <p className='mt-2'>
          Created: {data.createdAt.split('T')[0]} {} {data.createdAt.split('T')[1].split('.')[0]}
        </p>
      </div>

      {isAdmin && (
        <div className='flex items-center justify-between gap-2'>
          <Button
            type='submit'
            width='w-1/2 self-center'
            onClick={() => {
              setAction('edit');
              handleCloseAll();
            }}
            disabled={!isChanged || selectedUsers?.length < 3}
          >
            Update Group
          </Button>
          <Button
            type='submit'
            width='w-1/2 self-center'
            onClick={() => {
              setAction('delete');
              handleCloseAll();
            }}
          >
            Delete Group
          </Button>
        </div>
      )}
    </>
  );
};

export default GroupFullInfo;
