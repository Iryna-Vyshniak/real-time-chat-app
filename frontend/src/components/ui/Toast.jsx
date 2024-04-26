import { Toaster } from 'react-hot-toast';

const Toast = () => {
  return (
    <Toaster
      containerStyle={{
        zIndex: 9999,
        position: 'fixed',
        top: '1%',
        left: 0,
        width: '100%',
        height: '100%',
      }}
      toastOptions={{
        style: {
          zIndex: 9999, // For toasts
        },
      }}
    />
  );
};

export default Toast;
