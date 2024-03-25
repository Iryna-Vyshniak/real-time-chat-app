import { downloadImage } from '../../../../shared/utils/index';

import Icon from '../../../ui/Icon';

const DownloadImage = ({ message }) => {
  return (
    <a
      href={downloadImage(message.img)}
      download
      target='_blank'
      rel='noopener noreferrer'
      className='absolute bottom-3 right-1 z-20 flex items-center justify-center p-1 hover:bg-white/20 rounded-lg focus:ring-1 focus:ring-primary focus:outline-none'
    >
      <Icon src='#icon-download' style='w-4 h-4' />
    </a>
  );
};

export default DownloadImage;
