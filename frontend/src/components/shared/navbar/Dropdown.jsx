import DropdownContent from './DropdownContent';

const Dropdown = ({ avatar }) => {
  return (
    <div className='dropdown dropdown-end md:dropdown-right'>
      {avatar}

      <DropdownContent />
    </div>
  );
};

export default Dropdown;
