import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { selectSortOption } from '../features/products/productSlice';

const Sort = ({ onSortChange, initialSort }) => {
  const reduxSortOption = useSelector(selectSortOption);
  const [sortOption, setSortOption] = useState(initialSort || reduxSortOption);

  // Update local state when prop changes (for reset functionality)
  useEffect(() => {
    setSortOption(initialSort || reduxSortOption);
  }, [initialSort, reduxSortOption]);

  const handleSortChange = (e) => {
    // Only update local state, not Redux
    setSortOption(e.target.value);
    // Pass the new value up to parent
    if (onSortChange) {
      onSortChange(e.target.value);
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Sort by:</label>
      <select
        value={sortOption}
        onChange={handleSortChange}
        className="w-full p-2 border rounded"
      >
        <option value="popularity">Popularity</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="grade-asc">Nutrition Grade (Best First)</option>
        <option value="grade-desc">Nutrition Grade (Worst First)</option>
      </select>
    </div>
  );
};

export default Sort;