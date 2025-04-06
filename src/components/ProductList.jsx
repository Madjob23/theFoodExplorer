import React, { useEffect, useRef, useCallback } from 'react';
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
import ProductCard from './ProductCard';

const ProductList = () => {
  const dispatch = useDispatch();
  const products = useSelector(selectAllProducts);
  const status = useSelector(selectProductsStatus);
  const error = useSelector(selectProductsError);
  const page = useSelector(selectCurrentPage);
  const query = useSelector(selectSearchQuery);
  const category = useSelector(selectSelectedCategory);
  const sort = useSelector(selectSortOption);

  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && products.length > 0) {
        dispatch(setPage(page + 1));
      }
    });
    if (node) observer.current.observe(node);
  }, [status, page, dispatch, products.length]);

  useEffect(() => {
    dispatch(fetchProducts({ query, category, sort, page }));
  }, [dispatch, query, category, sort, page]);

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
            <div ref={lastProductElementRef} key={product.code}>
              <ProductCard product={product} />
            </div>
          );
        } else {
          return <ProductCard key={product.code} product={product} />;
        }
      })}
      {status === 'loading' && (
        <div className="col-span-full text-center my-4">Loading more products...</div>
      )}
    </div>
  );
};

export default ProductList;