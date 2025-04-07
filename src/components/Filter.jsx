import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchCategories,
  selectCategories,
  selectCategoriesStatus,
} from '../features/products/productSlice';

const Filter = ({ onCategoryChange, initialCategory }) => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory || '');

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  // Update local state when prop changes (for reset functionality)
  useEffect(() => {
    setSelectedCategory(initialCategory || '');
  }, [initialCategory]);

  const handleChange = (e) => {
    // Only update local state, not Redux
    setSelectedCategory(e.target.value);
    // Pass the new value up to parent
    if (onCategoryChange) {
      onCategoryChange(e.target.value);
    }
  };

  if (status === 'loading' && categories.length === 0) {
    return <div className="mb-4 text-gray-500">Loading categories...</div>;
  }

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Filter by Category:</label>
      <select
        value={selectedCategory}
        onChange={handleChange}
        className="w-full p-2 border rounded"
        disabled={status === 'loading'}
      >
        <option value="">All Categories</option>
        {categories.slice(0, 50).map(category => (
          <option key={category.id} value={category.id}>
            {category.name} ({category.products})
          </option>
        ))}
      </select>
    </div>
  );
};

export default Filter;