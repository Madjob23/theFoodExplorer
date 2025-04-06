import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts,
  selectSearchQuery,
  selectSelectedCategory,
  selectSortOption,
  resetFilters
} from './productSlice';
import Filter from '../../components/Filter';
import Sort from '../../components/Sort';
import ProductList from '../../components/ProductList';
import Search from '../../components/Search';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const query = useSelector(selectSearchQuery);
  const category = useSelector(selectSelectedCategory);
  const sort = useSelector(selectSortOption);

  useEffect(() => {
    // Only fetch products on initial load, not on page changes
    // Page changes are handled by the infinite scroll
    dispatch(fetchProducts({ query, category, sort, page: 1 }));
  }, [dispatch, query, category, sort]);

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Left sidebar for filters */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <div className="bg-white p-4 rounded shadow">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            <Filter />
            <Sort />
            <button 
              onClick={handleResetFilters}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 mt-4"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              {query ? `Search: "${query}"` : category ? `Category: ${category}` : 'All Products'}
            </h1>
          </div>
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;