import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { 
  addToCart, 
  removeFromCart,
  selectItemInCart
} from '../features/cart/cartSlice';

function AddToCartButton({ product, size = "normal", showSeeInCart = true }) {
  const dispatch = useDispatch();
  const cartItem = useSelector(selectItemInCart(product.code));
  const [quantity, setQuantity] = useState(1);
  
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    setQuantity(1); // Reset quantity after adding
  };
  
  const handleRemoveFromCart = () => {
    dispatch(removeFromCart(product.code));
  };
  
  const handleIncrement = () => {
    setQuantity(prev => prev + 1);
  };
  
  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };
  
  // Determine classes based on size prop
  const buttonClasses = size === "small" 
    ? "px-2 py-1 text-sm" 
    : "px-4 py-2";
  
  const quantityClasses = size === "small"
    ? "w-6 h-6 text-sm"
    : "w-8 h-8";

  return (
    <div className="flex flex-col gap-2">
      {cartItem ? (
        <div className="flex items-center gap-2">
          <button
            onClick={handleRemoveFromCart}
            className={`bg-red-500 text-white rounded ${buttonClasses}`}
          >
            Remove from Cart
          </button>
          
          {showSeeInCart && (
            <Link 
              to="/cart" 
              className="bg-blue-600 text-white rounded px-2 py-1 ml-2"
            >
              See in Cart
            </Link>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            disabled={quantity <= 1}
            className={`bg-gray-200 rounded-full ${quantityClasses} flex items-center justify-center ${quantity <= 1 ? 'opacity-50' : ''}`}
            aria-label="Decrease quantity"
          >
            -
          </button>
          
          <span className="font-medium">
            {quantity}
          </span>
          
          <button
            onClick={handleIncrement}
            className={`bg-gray-200 rounded-full ${quantityClasses} flex items-center justify-center`}
            aria-label="Increase quantity"
          >
            +
          </button>
          
          <button
            onClick={handleAddToCart}
            className={`bg-blue-600 text-white rounded ${buttonClasses} ml-2`}
          >
            Add to Cart
          </button>
        </div>
      )}
    </div>
  );
}

export default AddToCartButton;