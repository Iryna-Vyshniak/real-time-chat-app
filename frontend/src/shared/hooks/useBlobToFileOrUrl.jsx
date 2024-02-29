import useConversation from '../../store/useConversation';

export const useBlobToFileOrUrl = () => {
  const { mediaFile, setMediaFile } = useConversation();
  const { mediaUrl, setMediaUrl } = useConversation();

  const blobToAudioFile = (blob, filename) => {
    const newFile = new File([blob], filename, { type: 'audio/wav' });
    setMediaFile(newFile);
  };

  const blobToVideoFile = (blob, filename) => {
    const newFile = new File([blob], filename, { type: 'video/mp4' });
    setMediaFile(newFile);
  };

  const blobToBase64 = async (blobUrl) => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = function () {
        const base64Data = reader.result;
        setMediaUrl(base64Data);
      };
    } catch (error) {
      console.error('Error converting blob URL to base64:', error);
    }
  };

  return {
    mediaFile,
    mediaUrl,
    setMediaFile,
    setMediaUrl,
    blobToAudioFile,
    blobToVideoFile,
    blobToBase64,
  };
};
