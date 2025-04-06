import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProducts,
  selectAllProducts,
  selectProductsStatus,
  selectProductsError,
  selectCurrentPage,
  selectSearchQuery,
  selectSelectedCategory,
  selectSortOption,
  setPage
} from '../features/products/productSlice';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import ProductCard from './ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const currentPage = useSelector(selectCurrentPage);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedCategory = useSelector(selectSelectedCategory);
  const sortOption = useSelector(selectSortOption);
  
  // State to track if we're doing an initial search (replacing content vs loading more)
  const [isSearching, setIsSearching] = useState(false);
  const [prevQuery, setPrevQuery] = useState(searchQuery);
  const [prevCategory, setPrevCategory] = useState(selectedCategory);
  const [prevSort, setPrevSort] = useState(sortOption);
  
  // Detect when search parameters change to show the full loading indicator
  useEffect(() => {
    // If search parameters have changed, we're doing a new search
    if (searchQuery !== prevQuery || selectedCategory !== prevCategory || sortOption !== prevSort) {
      setIsSearching(true);
      setPrevQuery(searchQuery);
      setPrevCategory(selectedCategory);
      setPrevSort(sortOption);
    }
    
    // When loading is complete, we're no longer searching
    if (status !== 'loading') {
      setIsSearching(false);
    }
  }, [searchQuery, selectedCategory, sortOption, status, prevQuery, prevCategory, prevSort]);

  const loadMoreProducts = useCallback(() => {
    if (status !== 'loading') {
      dispatch(setPage(currentPage + 1));
      dispatch(fetchProducts({
        query: searchQuery,
        category: selectedCategory,
        sort: sortOption,
        page: currentPage + 1
      }));
    }
  }, [dispatch, status, currentPage, searchQuery, selectedCategory, sortOption]);

  const lastProductRef = useInfiniteScroll(loadMoreProducts, status === 'loading');

  // Show loading indicator when doing a brand new search
  if ((status === 'loading' && products.length === 0) || (status === 'loading' && isSearching)) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
          <div className="absolute top-0 left-0 w-full h-full border-8 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
        </div>
        <p className="mt-4 text-lg font-medium text-gray-700">
          {searchQuery ? `Searching for "${searchQuery}"...` : 
           selectedCategory ? `Loading ${selectedCategory} products...` : 
           'Loading products...'}
        </p>
        <p className="text-sm text-gray-500 mt-2">This may take a moment</p>
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-red-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-lg font-medium text-red-800 mb-2">Error Loading Products</h3>
          <p className="text-red-700">{error || 'Something went wrong. Please try again later.'}</p>
        </div>
      </div>
    );
  }

  if (products.length === 0 && status === 'succeeded') {
    return (
      <div className="min-h-[200px] flex items-center justify-center">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center max-w-md">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-yellow-500 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
          <h3 className="text-lg font-medium text-yellow-800 mb-2">No Products Found</h3>
          <p className="text-yellow-700">
            {searchQuery 
              ? `No results found for "${searchQuery}". Try different search terms.` 
              : selectedCategory
                ? `No products found in the "${selectedCategory}" category.`
                : 'No products match the selected filters. Try adjusting your criteria.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, index) => {
          if (index === products.length - 1) {
            return (
              <div ref={lastProductRef} key={product.code || index}>
                <ProductCard product={product} />
              </div>
            );
          } else {
            return <ProductCard key={product.code || index} product={product} />;
          }
        })}
      </div>

      {/* Loading more indicator (only show when loading more, not during initial search) */}
      {status === 'loading' && !isSearching && products.length > 0 && (
        <div className="my-8 flex justify-center">
          <div className="flex items-center space-x-3 bg-white rounded-lg shadow-md px-6 py-3">
            <div className="w-6 h-6 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
            <span className="text-gray-700">Loading more products...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;