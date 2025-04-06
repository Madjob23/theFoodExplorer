import React, { useCallback } from 'react';
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
} from '../features/products/productsSlice';
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

  if (status === 'failed') {
    return <div className="text-red-500 text-center my-4">{error}</div>;
  }

  if (products.length === 0 && status === 'succeeded') {
    return <div className="text-center my-4">No products found. Try different search criteria.</div>;
  }

  return (
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
      {status === 'loading' && (
        <div className="col-span-full text-center my-4">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2">Loading more products...</p>
        </div>
      )}
    </div>
  );
};

export default ProductList;