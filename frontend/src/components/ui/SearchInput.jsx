import Button from './Button';
import Icon from './Icon';

const SearchInput = ({ search, setSearch, handleSearch, hasForm }) => {
  return (
    <>
      {hasForm ? (
        <form
          className='flex items-center justify-center gap-2'
          onSubmit={handleSearch}
          autoComplete='off'
        >
          <input
            type='search'
            placeholder='Search...'
            name='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='input input-bordered h-9 rounded-full bg-beige text-slate-900 placeholder:text-slate-600'
          />
          <Button type='submit' style='btn-circle btn-sm' onSubmit={handleSearch}>
            <Icon
              src='#icon-search'
              style='w-[18px] h-[18px] drop-shadow-[0px_1px_0.5px_rgba(0,0,0,1)]'
            />
          </Button>
        </form>
      ) : (
        <div className='flex items-center justify-center gap-2 text-slate-900'>
          <input
            type='search'
            placeholder='Search...'
            name='search'
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className='input input-bordered h-9 rounded-full bg-beige text-slate-900 placeholder:text-slate-600'
          />
          <Button type='button' style='btn-circle' onClick={handleSearch}>
            <Icon
              src='#icon-search'
              style='w-[18px] h-[18px] drop-shadow-[0px_1px_0.5px_rgba(0,0,0,1)]'
            />
          </Button>
        </div>
      )}
    </>
  );
};

export default SearchInput;
