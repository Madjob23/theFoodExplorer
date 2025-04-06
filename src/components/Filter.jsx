import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  setCategory,
  selectCategories,
  selectCategoriesStatus,
  selectSelectedCategory
} from '../features/products/productSlice';

const Filter = () => {
  const dispatch = useDispatch();
  const categories = useSelector(selectCategories);
  const status = useSelector(selectCategoriesStatus);
  const selectedCategory = useSelector(selectSelectedCategory);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchCategories());
    }
  }, [status, dispatch]);

  const handleCategoryChange = (e) => {
    dispatch(setCategory(e.target.value));
  };

  if (status === 'loading') {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="mb-4">
      <label className="block mb-2 font-bold">Filter by Category:</label>
      <select
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full p-2 border rounded"
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