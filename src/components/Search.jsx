import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  setSearchQuery, 
  fetchProducts,
  fetchProductByBarcode,
  fetchSearchSuggestions,
  selectSearchSuggestions,
  selectSuggestionsStatus
} from '../features/products/productSlice';

const Search = () => {
  const [input, setInput] = useState('');
  const [searchType, setSearchType] = useState('name');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const suggestions = useSelector(selectSearchSuggestions);
  const suggestionsStatus = useSelector(selectSuggestionsStatus);
  const suggestionRef = useRef(null);
  
  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionRef.current && !suggestionRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Debounce search suggestions
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      if (searchType === 'name' && input.length >= 2) {
        dispatch(fetchSearchSuggestions(input));
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    }, 300); // 300ms debounce time
    
    return () => clearTimeout(debounceTimer);
  }, [input, searchType, dispatch]);

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
    
    setShowSuggestions(false);
  };
  
  const handleSuggestionClick = (productName) => {
    setInput(productName);
    dispatch(setSearchQuery(productName));
    dispatch(fetchProducts({ query: productName, page: 1 }));
    navigate('/');
    setShowSuggestions(false);
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
          onChange={(e) => {
            setSearchType(e.target.value);
            setShowSuggestions(false);
          }}
          className="bg-white text-gray-800 px-2 rounded-l min-w-16"
        >
          <option value="name">Name</option>
          <option value="barcode">Barcode</option>
        </select>
        <div className="relative flex-grow">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={searchType === 'name' ? "Search..." : "Barcode..."}
            className="bg-zinc-200 text-black w-full p-2 focus:outline-none min-w-0"
            onFocus={() => {
              if (searchType === 'name' && input.length >= 2) {
                setShowSuggestions(true);
              }
            }}
          />
          
          {/* Suggestions dropdown */}
          {showSuggestions && searchType === 'name' && (
            <div 
              ref={suggestionRef} 
              className="absolute z-10 left-0 right-0 mt-1 bg-white border border-gray-300 rounded shadow-lg max-h-60 overflow-y-auto"
            >
              {suggestionsStatus === 'loading' && (
                <div className="py-2 px-3 text-gray-500 italic">Loading suggestions...</div>
              )}
              
              {suggestionsStatus === 'succeeded' && suggestions.length === 0 && (
                <div className="py-2 px-3 text-gray-500 italic">No suggestions found</div>
              )}
              
              {suggestionsStatus === 'succeeded' && suggestions.length > 0 && (
                <ul className='bg-zinc-200'>
                  {suggestions.map((product) => (
                    <li 
                      key={product.code}
                      className="py-2 px-3 hover:bg-blue-50 cursor-pointer flex items-center"
                      onClick={() => handleSuggestionClick(product.product_name)}
                    >
                      {product.image_small_url && (
                        <img 
                          src={product.image_small_url} 
                          alt={product.product_name}
                          className="w-8 h-8 object-contain mr-2 rounded"
                        />
                      )}
                      <div>
                        <div className="font-medium text-black">{product.product_name}</div>
                        {product.brands && (
                          <div className="text-xs text-black">{product.brands}</div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
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