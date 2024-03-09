import { useState } from 'react';

export default function AlbumSort({ albums, onSortChange }) {
  const [sortType, setSortType] = useState('');

  const handleSortChange = (option) => {
    setSortType(option);
    onSortChange(option);
  };

  return (
    <div className='mt-2 ml-5 inline-flex shadow-sm'>
      <select className='outline-none' value={sortType} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="">Sort by</option>
        <option value="alphabetical">Alphabetical</option>
        <option value="ascending">Newest to Oldest</option>
        <option value="descending">Oldest to Newest</option>
      </select>
    </div>
  );
}
