import { useEffect, useState, useCallback } from 'react';

export const useForm = (initialState, onSubmit) => {
  const [state, setState] = useState(initialState);

  const handleChange = ({ target }) => {
    const { value, name, type, checked } = target;

    const newValue = type === 'checkbox' ? checked : value;

    setState((prev) => ({ ...prev, [name]: newValue }));
    localStorage.setItem('formdata', JSON.stringify({ ...state, [name]: newValue }));
  };

  useEffect(() => {
    let savedData = localStorage.getItem('formdata');
    savedData = savedData ? JSON.parse(savedData) : {};

    if (savedData) {
      setState(savedData);
    }
  }, []);

  const reset = useCallback(() => setState({ ...initialState }), [initialState]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    onSubmit({ ...state });

    if (localStorage.getItem('formdata')) {
      localStorage.removeItem('formdata');
    }

    reset();
  };

  return { state, setState, handleChange, reset, handleSubmit };
};
