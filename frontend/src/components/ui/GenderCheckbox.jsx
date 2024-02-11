const GenderCheckbox = ({ selectedGender, handleChange }) => {
  return (
    <div className='flex mt-2'>
      <div className='form-control'>
        <label className={`label gap-2 cursor-pointer`}>
          <span className='label-text text-slate-300'>Male</span>
          <input
            type='radio'
            name='gender'
            value='male'
            className='radio radio-info border-slate-300'
            checked={selectedGender === 'male'}
            onChange={handleChange}
          />
        </label>
      </div>
      <div className='form-control'>
        <label className={`label gap-2 cursor-pointer`}>
          <span className='label-text text-slate-300'>Female</span>
          <input
            type='radio'
            name='gender'
            value='female'
            className='radio radio-info border-slate-300'
            checked={selectedGender === 'female'}
            onChange={handleChange}
          />
        </label>
      </div>
    </div>
  );
};

export default GenderCheckbox;
