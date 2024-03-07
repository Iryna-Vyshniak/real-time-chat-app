const TRANSITION = { type: 'spring', mass: 0.25 };

export const VARIANTS_MANAGER = {
  box: {
    visible: { opacity: 1, scale: 1, transition: TRANSITION },
    hidden: { opacity: 0, scale: 0 },
  },
  square: {
    visible: { opacity: 1, scale: 4, transition: TRANSITION },
    hidden: { opacity: 0, scale: 0 },
  },
  'fade-in': {
    opacity: 1,
  },
  'fade-out': {
    opacity: 0,
  },
  'slide-in': {
    x: 0,
    opacity: 1,
    transition: TRANSITION,
  },
  'slide-from-left': {
    x: '-20%',
    opacity: 0,
    transition: TRANSITION,
  },
  'slide-from-right': {
    x: '20%',
    opacity: 0,
    transition: TRANSITION,
  },
  'pop-in': {
    opacity: 1,
    y: '0',
    scale: 1,
  },
  'pop-out': {
    opacity: 0.3,
    y: '-20%',
    scale: 0.5,
  },
};
