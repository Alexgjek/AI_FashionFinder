import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

export default function SearchBar({ onSearch }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query.trim()); 
  };

  const handleChange = (e) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    onSearch(newQuery.trim());
  };

  return (
    <form className='mt-3 shadow-md border border-gray-300' onSubmit={handleSubmit}>
      <input 
        className='outline-none p-1'
        type="text" 
        placeholder="Search..." 
        value={query} 
        onChange={handleChange}
      />
      <button className="bg-transparent border border-gray-300 shadow-md h-full p-1" type="submit">
        <FontAwesomeIcon icon={faSearch} />
      </button>
    </form>
  );
};
