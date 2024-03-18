import { useState } from 'react';

export default function AlbumSort({ albums, onSortChange }) {
  const [sortType, setSortType] = useState('');

  const handleSortChange = (option) => {
    setSortType(option);
    onSortChange(option);
  };

  return (
    <div className='mt-3 ml-5 inline-flex shadow-md border border-gray-300'>
      <select className='outline-none' value={sortType} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="">Sort by</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="descending">Newest to Oldest</option>
        <option value="ascending">Oldest to Newest</option>
      </select>
    </div>
  );
}
