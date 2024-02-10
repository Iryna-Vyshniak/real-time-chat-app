import { useEffect, useState } from 'react';
import { bgImages } from '../../../data';

const Dialog = () => {
  const [bgImage, setBgImages] = useState(localStorage.getItem('bg') || bgImages[0].img);

  const handleClick = (img) => {
    setBgImages(img);
  };

  useEffect(() => {
    localStorage.setItem('bg', bgImage);
    document.body.style = `background: linear-gradient(to top, rgba(0, 0, 0, 0.4) 50%, transparent),
    url(${bgImage}) center center / cover no-repeat`;
  }, [bgImage]);

  return (
    <dialog id='settings' className='modal'>
      <div className='modal-box p-6 w-96 max-w-full min-h-[26rem] rounded-lg shadow-lg bg-slate-400 bg-clip-padding backdrop-filter backdrop-blur-xl bg-opacity-0'>
        <form method='dialog'>
          <button className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white/50'>
            ✕
          </button>
        </form>
        <h3 className='font-bold text-lg text-white/50'>Hello!</h3>
        <p className='py-4 text-white/50'>Setup background</p>
        <ul className='flex items-center justify-center flex-wrap gap-2 w-full'>
          {bgImages.map(({ img, id }) => {
            return (
              <li
                key={id}
                onClick={() => handleClick(img)}
                className='pointer w-[64px] h-[64px] rounded-sm shadow-lg hover:border-2 hover:border-slate-100'
                style={{
                  background: `linear-gradient(to top, rgba(0, 0, 0, 0.384) 50%, transparent),
    url(${img}) center center / cover fixed no-repeat`,
                }}
              ></li>
            );
          })}
        </ul>
      </div>
    </dialog>
  );
};

export default Dialog;
