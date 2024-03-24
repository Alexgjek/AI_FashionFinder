import { useState } from 'react';

export default function OutfitSort({ outfits, onSortChange }) {
  const [sortType, setSortType] = useState('');

  const handleSortChange = (option) => {
    setSortType(option);
    onSortChange(option);
  };

  return (
    <div className='mt-3 ml-5 inline-flex shadow-md border border-gray-300'>
      <select className='outline-none' value={sortType} onChange={(e) => handleSortChange(e.target.value)}>
        <option value="">Sort by</option>
        <option value="ascendingPrice">Price Low to High</option>
        <option value="descendingPrice">Price High to Low</option>
        <option value="ascendingRating">Rating Low to High</option>
        <option value="descendingRating">Rating High to Low</option>
        <option value="descending">Newest to Oldest</option>
        <option value="ascending">Oldest to Newest</option>
      </select>
    </div>
  );
}

