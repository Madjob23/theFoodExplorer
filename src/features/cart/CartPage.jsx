import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  selectCartItems,
  selectCartTotalItems,
  removeFromCart,
  incrementQuantity,
  decrementQuantity,
  clearCart
} from './cartSlice';

function CartPage() {
  const cartItems = useSelector(selectCartItems);
  const totalItems = useSelector(selectCartTotalItems);
  const dispatch = useDispatch();
  
  const handleRemoveItem = (code) => {
    dispatch(removeFromCart(code));
  };
  
  const handleIncrement = (code) => {
    dispatch(incrementQuantity(code));
  };
  
  const handleDecrement = (code) => {
    dispatch(decrementQuantity(code));
  };
  
  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart());
    }
  };
  
  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-lg mb-4">Your cart is empty</p>
          <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
            Explore Products
          </Link>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Your Cart ({totalItems} items)</h1>
        <button
          onClick={handleClearCart}
          className="text-red-600 hover:underline"
        >
          Clear Cart
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {cartItems.map(item => (
          <div key={item.code} className="p-4 border-b">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              {/* Product Info */}
              <div className="flex items-center mb-4 md:mb-0">
                <div className="w-16 h-16 mr-4">
                  <img 
                    src={item.image_url || 'https://via.placeholder.com/100x100?text=No+Image'} 
                    alt={item.product_name} 
                    className="w-full h-full object-cover rounded"
                  />
                </div>
                <div>
                  <Link to={`/product/${item.code}`} className="font-bold hover:text-blue-600">
                    {item.product_name}
                  </Link>
                  {item.brands && (
                    <p className="text-sm text-gray-600">{item.brands}</p>
                  )}
                  {item.nutrition_grade_fr && (
                    <span className={`inline-block text-xs px-2 py-0.5 rounded text-white ${
                      item.nutrition_grade_fr === 'a' ? 'bg-green-500' :
                      item.nutrition_grade_fr === 'b' ? 'bg-green-400' :
                      item.nutrition_grade_fr === 'c' ? 'bg-yellow-500' :
                      item.nutrition_grade_fr === 'd' ? 'bg-orange-500' :
                      item.nutrition_grade_fr === 'e' ? 'bg-red-500' :
                      'bg-gray-500'
                    }`}>
                      Grade: {item.nutrition_grade_fr.toUpperCase()}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                {/* Quantity Controls */}
                <div className="flex items-center mr-4">
                  <button
                    onClick={() => handleDecrement(item.code)}
                    disabled={item.quantity <= 1}
                    className={`w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center ${
                      item.quantity <= 1 ? 'opacity-50' : ''
                    }`}
                    aria-label="Decrease quantity"
                  >
                    -
                  </button>
                  <span className="mx-4 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => handleIncrement(item.code)}
                    className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                
                {/* Remove Button */}
                <button
                  onClick={() => handleRemoveItem(item.code)}
                  className="bg-red-500 text-white rounded px-3 py-1 text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Cart Summary */}
        <div className="p-4 bg-gray-50">
          <div className="flex justify-between mb-2">
            <span className="font-bold">Total Items:</span>
            <span>{totalItems}</span>
          </div>
          <div className="mt-4">
            <Link to="/" className="bg-blue-600 text-white px-4 py-2 rounded">
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;