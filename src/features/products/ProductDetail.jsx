import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductByBarcode,
  selectSelectedProduct,
  selectSelectedProductStatus
} from './productSlice.js';

const ProductDetail = () => {
  const { barcode } = useParams();
  const dispatch = useDispatch();
  const product = useSelector(selectSelectedProduct);
  const status = useSelector(selectSelectedProductStatus);

  useEffect(() => {
    dispatch(fetchProductByBarcode(barcode));
  }, [dispatch, barcode]);

  if (status === 'loading') {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading product details...</div>
      </div>
    );
  }

  if (status === 'failed' || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center text-red-500">
          Failed to load product. The product may not exist or there was an error.
        </div>
        <div className="text-center mt-4">
          <Link to="/" className="text-blue-500 hover:underline">
            Return to products
          </Link>
        </div>
      </div>
    );
  }

  // Helper function to display nutrition grade with visual indicator
  const getNutritionGrade = (grade) => {
    const grades = {
      'a': { color: 'bg-green-500', text: 'Excellent' },
      'b': { color: 'bg-green-300', text: 'Good' },
      'c': { color: 'bg-yellow-400', text: 'Fair' },
      'd': { color: 'bg-orange-500', text: 'Poor' },
      'e': { color: 'bg-red-500', text: 'Bad' }
    };
    
    const gradeInfo = grade && grades[grade.toLowerCase()] 
      ? grades[grade.toLowerCase()] 
      : { color: 'bg-gray-400', text: 'Unknown' };
    
    return (
      <div className="flex items-center">
        <span className={`${gradeInfo.color} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-2`}>
          {grade ? grade.toUpperCase() : '?'}
        </span>
        <span>{gradeInfo.text}</span>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/" className="text-blue-500 hover:underline mb-4 inline-block">
        &larr; Back to products
      </Link>
      
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="md:flex">
          {/* Product Image */}
          <div className="md:w-1/3 p-4">
            <img 
              src={product.image_url || 'https://via.placeholder.com/400x400?text=No+Image'} 
              alt={product.product_name} 
              className="w-full h-auto object-contain max-h-96"
            />
          </div>
          
          {/* Product Info */}
          <div className="md:w-2/3 p-4">
            <h1 className="text-2xl font-bold mb-2">{product.product_name}</h1>
            
            {product.brands && (
              <p className="text-gray-600 mb-4">Brand: {product.brands}</p>
            )}
            
            <div className="mb-4">
              <h2 className="font-bold text-lg mb-2">Nutrition Grade:</h2>
              {getNutritionGrade(product.nutrition_grade_fr)}
            </div>
            
            {product.categories && (
              <div className="mb-4">
                <h2 className="font-bold text-lg mb-2">Categories:</h2>
                <p>{product.categories}</p>
              </div>
            )}
            
            {product.labels && (
              <div className="mb-4">
                <h2 className="font-bold text-lg mb-2">Labels:</h2>
                <div className="flex flex-wrap">
                  {product.labels.split(',').map((label, index) => (
                    <span 
                      key={index} 
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded mr-2 mb-2 text-sm"
                    >
                      {label.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Ingredients */}
        {product.ingredients_text && (
          <div className="p-4 border-t">
            <h2 className="font-bold text-xl mb-2">Ingredients</h2>
            <p className="whitespace-pre-line">{product.ingredients_text}</p>
          </div>
        )}
        
        {/* Nutritional Values */}
        {product.nutriments && (
          <div className="p-4 border-t">
            <h2 className="font-bold text-xl mb-4">Nutritional Values (per 100g)</h2>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Energy</p>
                <p>{product.nutriments.energy || 0} {product.nutriments.energy_unit || 'kcal'}</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Fat</p>
                <p>{product.nutriments.fat || 0}g</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Carbohydrates</p>
                <p>{product.nutriments.carbohydrates || 0}g</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Proteins</p>
                <p>{product.nutriments.proteins || 0}g</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Salt</p>
                <p>{product.nutriments.salt || 0}g</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Saturated Fat</p>
                <p>{product.nutriments['saturated-fat'] || 0}g</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Sugars</p>
                <p>{product.nutriments.sugars || 0}g</p>
              </div>
              
              <div className="bg-gray-100 p-3 rounded">
                <p className="font-bold">Fiber</p>
                <p>{product.nutriments.fiber || 0}g</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Additional information */}
        <div className="p-4 border-t text-sm text-gray-600">
          <p>Barcode: {product.code}</p>
          {product.quantity && <p>Quantity: {product.quantity}</p>}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;