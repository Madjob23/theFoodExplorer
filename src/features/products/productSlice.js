import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = 'https://world.openfoodfacts.org';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async ({ query, category, sort, page = 1, pageSize = 24 }) => {
    let url = `${BASE_URL}/cgi/search.pl?action=process&json=true`;
    
    if (query) {
      url += `&search_terms=${encodeURIComponent(query)}`;
    }
    
    if (category) {
      url += `&tagtype_0=categories&tag_contains_0=contains&tag_0=${encodeURIComponent(category)}`;
    }
    
    if (sort) {
      switch(sort) {
        case 'name-asc':
          url += '&sort_by=product_name&sort_order=asc';
          break;
        case 'name-desc':
          url += '&sort_by=product_name&sort_order=desc';
          break;
        case 'grade-asc':
          url += '&sort_by=nutrition_grade_fr&sort_order=asc';
          break;
        case 'grade-desc':
          url += '&sort_by=nutrition_grade_fr&sort_order=desc';
          break;
        default:
          url += '&sort_by=popularity_key&sort_order=desc';
      }
    }
    
    url += `&page=${page}&page_size=${pageSize}`;
    
    try {
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  }
);

export const fetchProductByBarcode = createAsyncThunk(
  'products/fetchProductByBarcode',
  async (barcode) => {
    try {
      const response = await fetch(`${BASE_URL}/api/v0/product/${barcode}.json`);
      
      if (!response.ok) {
        throw new Error('Product not found');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching product by barcode:', error);
      throw error;
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'products/fetchCategories',
  async () => {
    try {
      const response = await fetch(`${BASE_URL}/categories.json`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    count: 0,
    page: 1,
    pageSize: 24,
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
    selectedProduct: null,
    selectedProductStatus: 'idle',
    selectedProductError: null,
    categories: [],
    categoriesStatus: 'idle',
    categoriesError: null,
    searchQuery: '',
    selectedCategory: '',
    sortOption: 'popularity'
  },
  reducers: {
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.page = 1; // Reset to first page when search changes
    },
    setCategory: (state, action) => {
      state.selectedCategory = action.payload;
      state.page = 1; // Reset to first page when category changes
    },
    setSortOption: (state, action) => {
      state.sortOption = action.payload;
      state.page = 1; // Reset to first page when sort changes
    },
    setPage: (state, action) => {
      state.page = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = '';
      state.sortOption = 'popularity';
      state.page = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Handle fetchProducts states
      .addCase(fetchProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        
        // Check if this is the first page or a subsequent page
        if (action.meta.arg.page === 1) {
          // First page: replace the items array
          state.items = action.payload.products || [];
        } else {
          // Subsequent pages: append to existing items
          // Optionally prevent duplicates
          const existingProductCodes = new Set(state.items.map(item => item.code));
          const newProducts = (action.payload.products || []).filter(
            product => !existingProductCodes.has(product.code)
          );
          
          state.items = [...state.items, ...newProducts];
        }
        
        state.count = action.payload.count || 0;
        state.page = action.meta.arg.page || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      
      // Handle fetchProductByBarcode states
      .addCase(fetchProductByBarcode.pending, (state) => {
        state.selectedProductStatus = 'loading';
      })
      .addCase(fetchProductByBarcode.fulfilled, (state, action) => {
        state.selectedProductStatus = 'succeeded';
        state.selectedProduct = action.payload.product;
      })
      .addCase(fetchProductByBarcode.rejected, (state, action) => {
        state.selectedProductStatus = 'failed';
        state.selectedProductError = action.error.message;
      })
      
      // Handle fetchCategories states
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesStatus = 'loading';
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesStatus = 'succeeded';
        state.categories = action.payload.tags || [];
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesStatus = 'failed';
        state.categoriesError = action.error.message;
      });
  }
});

export const {
  setSearchQuery,
  setCategory,
  setSortOption,
  setPage,
  resetFilters
} = productsSlice.actions;

export default productsSlice.reducer;

// Selectors
export const selectAllProducts = (state) => state.products.items;
export const selectProductsStatus = (state) => state.products.status;
export const selectProductsError = (state) => state.products.error;
export const selectProductsCount = (state) => state.products.count;
export const selectCurrentPage = (state) => state.products.page;
export const selectPageSize = (state) => state.products.pageSize;
export const selectSearchQuery = (state) => state.products.searchQuery;
export const selectSelectedCategory = (state) => state.products.selectedCategory;
export const selectSortOption = (state) => state.products.sortOption;
export const selectSelectedProduct = (state) => state.products.selectedProduct;
export const selectSelectedProductStatus = (state) => state.products.selectedProductStatus;
export const selectCategories = (state) => state.products.categories;
export const selectCategoriesStatus = (state) => state.products.categoriesStatus;