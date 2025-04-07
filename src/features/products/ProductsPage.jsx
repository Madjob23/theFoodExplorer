import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  fetchProducts,
  selectSearchQuery,
  selectSelectedCategory,
  selectSortOption,
  resetFilters,
  setCategory,
  setSortOption
} from './productSlice';
import Filter from '../../components/Filter';
import Sort from '../../components/Sort';
import ProductList from '../../components/ProductList';
import Search from '../../components/Search';

const ProductsPage = () => {
  const dispatch = useDispatch();
  const query = useSelector(selectSearchQuery);
  const reduxCategory = useSelector(selectSelectedCategory);
  const reduxSort = useSelector(selectSortOption);
  
  // Local state for filter values before they're applied
  const [localCategory, setLocalCategory] = useState(reduxCategory);
  const [localSort, setLocalSort] = useState(reduxSort);
  // Track if filters have been changed but not applied
  const [filtersChanged, setFiltersChanged] = useState(false);

  // Check if filters have changed from what's in Redux
  useEffect(() => {
    if (localCategory !== reduxCategory || localSort !== reduxSort) {
      setFiltersChanged(true);
    } else {
      setFiltersChanged(false);
    }
  }, [localCategory, localSort, reduxCategory, reduxSort]);

  // Initial data fetch
  useEffect(() => {
    dispatch(fetchProducts({ query, category: reduxCategory, sort: reduxSort, page: 1 }));
  }, [dispatch, query, reduxCategory, reduxSort]);

  // When category changes locally
  const handleCategoryChange = (newCategory) => {
    setLocalCategory(newCategory);
  };

  // When sort changes locally
  const handleSortChange = (newSort) => {
    setLocalSort(newSort);
  };

  // Apply filters button handler
  const handleApplyFilters = () => {
    if (filtersChanged) {
      dispatch(setCategory(localCategory));
      dispatch(setSortOption(localSort));
      dispatch(fetchProducts({ query, category: localCategory, sort: localSort, page: 1 }));
      setFiltersChanged(false);
    }
  };

  // Reset filters button handler
  const handleResetFilters = () => {
    dispatch(resetFilters());
    setLocalCategory('');
    setLocalSort('popularity');
    setFiltersChanged(false);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:space-x-6">
        {/* Left sidebar for filters */}
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <div className="sticky top-0 bg-white p-4 rounded shadow flex flex-col gap-4">
            <h2 className="text-xl font-bold mb-4">Filters</h2>
            
            <Filter 
              onCategoryChange={handleCategoryChange} 
              initialCategory={reduxCategory}
            />
            
            <Sort 
              onSortChange={handleSortChange} 
              initialSort={reduxSort}
            />
            
            {/* Apply Filters Button */}
            <button 
              onClick={handleApplyFilters}
              disabled={!filtersChanged}
              className={`w-full ${
                filtersChanged 
                  ? 'bg-blue-500 hover:bg-blue-600' 
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white py-2 rounded mb-3`}
            >
              Apply Filters
            </button>
            
            {/* Reset Filters Button */}
            <button 
              onClick={handleResetFilters}
              className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
            >
              Reset Filters
            </button>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="w-full md:w-3/4">
          <div className="container mx-auto px-4 py-6">
            <h1 className="text-2xl font-bold text-center">Discover food products. Know everything about 'em.</h1>
          </div>
          <div className="container mx-auto px-4 flex flex-col items-center">
            <p className="text-gray-600 text-xl mb-4">Browse through our collection of food products.</p>
            <p className="text-gray-600 text-xl mb-4">Search specific products by name or by barcode.</p>
            <p className="text-gray-600 text-xl mb-4">Click on a product card to get detailed facts about it.</p>
            <p className="text-gray-600 text-xl mb-4">Add selected products to your cart and manage their quantity.</p>
          </div>
          <div className="mb-4">
            <h1 className="text-2xl font-bold">
              {query ? `Search: "${query}"` : reduxCategory ? `Category: ${reduxCategory}` : 'All Products'}
            </h1>
          </div>
          <ProductList />
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;