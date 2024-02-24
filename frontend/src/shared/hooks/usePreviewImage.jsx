import { useState } from 'react';

export const usePreviewImage = () => {
  const [imgUrl, setImgUrl] = useState(null);

  const handleImageChange = ({ target }) => {
    const file = target.files[0];

    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImgUrl(reader.result);
      };

      reader.readAsDataURL(file);
    }
    setImgUrl(null);
  };

  return { handleImageChange, imgUrl };
};
