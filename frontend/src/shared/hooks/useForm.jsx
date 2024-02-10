import { useState } from 'react';

export const useForm = (initialState) => {
  const [state, setState] = useState(initialState);

  const handleChange = ({ target }) => {
    const { value, name, type, checked } = target;

    const newValue = type === 'checkbox' ? checked : value;

    setState((prev) => ({ ...prev, [name]: newValue }));
  };

  return { state, handleChange };
};
