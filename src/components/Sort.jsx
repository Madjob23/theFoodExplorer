import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSortOption,
  selectSortOption
} from '../features/products/productSlice';

const Sort = () => {
  const dispatch = useDispatch();
  const sortOption = useSelector(selectSortOption);

  const handleSortChange = (e) => {
    dispatch(setSortOption(e.target.value));
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