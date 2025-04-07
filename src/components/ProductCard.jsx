import React from 'react';
import { Link } from 'react-router-dom';
import AddToCartButton from './AddToCartButton';

const ProductCard = ({ product }) => {
  const imageUrl = product.image_url || 'https://via.placeholder.com/200x200?text=No+Image';
  
  // Convert nutrition grade to a visually appealing display
  const getNutritionBadge = (grade) => {
    const gradeMap = {
      'a': { bg: 'bg-green-500', text: 'text-white' },
      'b': { bg: 'bg-green-300', text: 'text-gray-800' },
      'c': { bg: 'bg-yellow-400', text: 'text-gray-800' },
      'd': { bg: 'bg-orange-500', text: 'text-white' },
      'e': { bg: 'bg-red-500', text: 'text-white' },
      'unknown': { bg: 'bg-gray-400', text: 'text-white' }
    };
    
    const gradeKey = (grade || 'unknown').toLowerCase();
    const style = gradeMap[gradeKey] || gradeMap.unknown;
    
    return (
      <span title='Nutrition grade' className={`${style.bg} ${style.text} px-2 py-1 rounded font-bold text-sm`}>
        {grade ? grade.toUpperCase() : '?'}
      </span>
    );
  };

  return (
    <div className="flex flex-col justify-between rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <Link to={`/product/${product.code}`} className="block">
        <div className="overflow-hidden">
          <div className="h-48 overflow-hidden">
            <img 
              src={imageUrl} 
              alt={product.product_name || 'Food product'} 
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 title={product.product_name || 'Unknown Product'} className="font-bold text-lg truncate">
                {product.product_name || 'Unknown Product'}
              </h3>
              {getNutritionBadge(product.nutrition_grade_fr)}
            </div>
            
            {product.categories_tags && (
              <p className="text-sm text-gray-600 mb-2 truncate">
                {product.categories_tags[0]?.replace('en:', '')}
              </p>
            )}
            
            {product.ingredients_text && (
              <p className="text-sm text-gray-700 line-clamp-2">
                {product.ingredients_text.substring(0, 100)}
                {product.ingredients_text.length > 100 ? '...' : ''}
              </p>
            )}
          </div>
        </div>
      </Link>
      <div className="px-4 pb-4">
      <AddToCartButton product={product} size="small" />
      </div>
    </div>
  );
};

export default ProductCard;