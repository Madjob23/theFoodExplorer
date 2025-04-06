import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setSearchQuery, 
  fetchProducts,
  fetchProductByBarcode
} from '../features/products/productSlice.js';

const Search = () => {
  const [input, setInput] = useState('');
  const [searchType, setSearchType] = useState('name');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    if (searchType === 'name') {
      dispatch(setSearchQuery(input));
      dispatch(fetchProducts({ query: input, page: 1 }));
      navigate('/');
    } else {
      // Handle barcode search
      dispatch(fetchProductByBarcode(input))
        .unwrap()
        .then(() => navigate(`/product/${input}`))
        .catch(err => alert(`Product not found: ${err.message}`));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full md:max-w-96">
      <label className='block text-lg mb-1' htmlFor="searchType">Search by:</label>
      <div className="flex shadow-md">
        <select
          name="searchType"
          id="searchType"
          defaultValue=''
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className=" shrink-0 bg-white text-gray-800 px-2 rounded-l min-w-16"
        >
          <option value="name">Name</option>
          <option value="barcode">Barcode</option>
        </select>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={searchType === 'name' ? "Search..." : "Barcode..."}
          className="bg-zinc-200 text-black flex-grow p-2 focus:outline-none min-w-0"
        />
        <button
          type="submit"
          className="bg-yellow-500 text-white p-2 rounded-r"
        >
          Search
        </button>
      </div>
    </form>
  );
};

export default Search;