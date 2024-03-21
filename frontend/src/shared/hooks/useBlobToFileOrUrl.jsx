import useConversation from '../../store/useConversation';

export const useBlobToFileOrUrl = () => {
  const { mediaFile, setMediaFile, audioUrl, setAudioUrl, videoUrl, setVideoUrl } =
    useConversation();

  const blobToAudioFile = (blob, filename) => {
    const newFile = new File([blob], filename, { type: 'audio/wav' });
    setMediaFile(newFile);
  };

  const blobToVideoFile = (blob, filename) => {
    const newFile = new File([blob], filename, { type: 'video/mp4' });
    setMediaFile(newFile);
  };

  const blobToBase64 = async (blobUrl, isAudio, isVideo) => {
    try {
      const response = await fetch(blobUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64Data = reader.result;
        if (isAudio && blob.type.startsWith('audio/')) {
          setAudioUrl(base64Data);
        }
        if (isVideo && blob.type.startsWith('video/')) {
          setVideoUrl(base64Data);
        }
      };
    } catch (error) {
      console.error('Error converting blob URL to base64:', error);
    }
  };

  return {
    mediaFile,
    audioUrl,
    videoUrl,
    blobToAudioFile,
    blobToVideoFile,
    blobToBase64,
  };
};
