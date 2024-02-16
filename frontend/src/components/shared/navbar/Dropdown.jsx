import DropdownContent from './DropdownContent';

const Dropdown = ({ avatar }) => {
  return (
    <div className='dropdown dropdown-end'>
      {avatar}

      <DropdownContent />
    </div>
  );
};

export default Dropdown;
