
import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="h-48 overflow-hidden bg-gray-200">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-800">{product.name}</h3>
          <span className="text-primary-light text-black font-bold">₹{product.price}/kg</span>
        </div>
        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
        <div className="mt-4 flex justify-between items-center">
          <Link 
            to={`/order?product=${product._id}`}
            className="inline-flex items-center text-white bg-green-900 hover:bg-primary-dark px-3 py-1.5 rounded transition-colors duration-200"
          >
            <ShoppingCart className="h-4 w-4 mr-1" />
            Order Now
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
