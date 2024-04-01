import { useEffect, useRef } from 'react';

const CircleRange = ({ value, max, onChange }) => {
  const circleRef = useRef();
  const radius = 63;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    circleRef.current.style.strokeDasharray = `${circumference} ${circumference}`;
    circleRef.current.style.strokeDashoffset = circumference;
  }, [circumference]);

  useEffect(() => {
    const progress = value / max;
    const dashoffset = circumference * (1 - progress);

    circleRef.current.style.strokeDashoffset = dashoffset;
  }, [value, max, circumference]);

  const handleChange = (event) => {
    onChange(event.target.value);
  };

  return (
    <div>
      <svg className='absolute top-0 right-0 z-30' width='130' height='130'>
        <circle
          ref={circleRef}
          strokeWidth='4'
          r={radius}
          cx='65'
          cy='65'
          className='transform -rotate-90 origin-center stroke-primary stroke-4 fill-transparent'
        />
      </svg>
      <input
        type='range'
        min='0'
        max={max}
        value={value}
        onChange={handleChange}
        className='hidden'
      />
    </div>
  );
};

export default CircleRange;
