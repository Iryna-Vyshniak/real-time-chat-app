import icon from '../../assets/icons/sprite.svg';

const Icon = ({ src, logic, style }) => {
  return (
    <svg width={24} height={24} className={style}>
      <use href={icon + (logic ? logic : src)}></use>
    </svg>
  );
};

export default Icon;
