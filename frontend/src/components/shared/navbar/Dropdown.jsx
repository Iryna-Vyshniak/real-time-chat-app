import DropdownContent from './DropdownContent';

const Dropdown = ({ avatar }) => {
  return (
    <div className='dropdown dropdown-bottom dropdown-left md:dropdown-right'>
      {avatar}

      <DropdownContent />
    </div>
  );
};

export default Dropdown;
