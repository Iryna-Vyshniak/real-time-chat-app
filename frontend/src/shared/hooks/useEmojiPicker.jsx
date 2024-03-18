import { useEffect, useRef, useState } from 'react';

import useConversation from '../../store/useConversation';

const useEmojiPicker = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentPopupId, setCurrentPopupId] = useState(null);

  const { addEmoji } = useConversation();
  const emojiPickerRef = useRef(null);

  // show popup
  const openEmojiPicker = (id) => {
    setShowEmojiPicker(true);
    setCurrentPopupId(id);
  };

  // add emoji
  const addEmojis = (messageId, emoji) => {
    addEmoji(messageId, emoji);
    setCurrentPopupId(null);
    setShowEmojiPicker(false);
  };

  // remove emoji
  const onEmojiClick = () => {
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(event.target)) {
        setCurrentPopupId(null);
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return {
    currentPopupId,
    showEmojiPicker,
    emojiPickerRef,
    onEmojiClick,
    addEmojis,
    openEmojiPicker,
  };
};

export default useEmojiPicker;
