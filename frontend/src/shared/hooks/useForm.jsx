import { useEffect, useState } from 'react';

export const useForm = (initialState) => {
  const [state, setState] = useState(initialState);

  const handleChange = ({ target }) => {
    const { value, name, type, checked } = target;

    const newValue = type === 'checkbox' ? checked : value;

    setState((prev) => ({ ...prev, [name]: newValue }));
    localStorage.setItem('formdata', JSON.stringify({ ...state, [name]: newValue }));
  };

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem('formdata'));

    if (savedData) {
      setState(savedData);
    }
  }, []);

  return { state, handleChange };
};
