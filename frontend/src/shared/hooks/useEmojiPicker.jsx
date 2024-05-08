import { useEffect, useRef, useState } from 'react';

const useEmojiPicker = () => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [currentPopupId, setCurrentPopupId] = useState(null);

  const emojiPickerRef = useRef(null);

  // show popup
  const openEmojiPicker = (id) => {
    setShowEmojiPicker(true);
    setCurrentPopupId(id);
  };

  // add emoji
  const addEmojis = () => {
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
