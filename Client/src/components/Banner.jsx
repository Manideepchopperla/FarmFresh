
import React from 'react';
import { Link } from 'react-router-dom';
import { Truck, ShoppingBag, Calendar } from 'lucide-react';

const Banner = () => {
  return (
    <div className="relative  overflow-hidden">
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1566385101042-1a0aa0c1268c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
          alt="Fresh vegetables" 
          className="w-full h-full object-cover opacity-20"
        />
      </div>
      <div className="relative max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white">
            Fresh from Farm to Table
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-green-100">
            Order bulk fresh produce directly from local farmers.
          </p>
          <div className="mt-8 flex justify-center">
            <Link
              to="/order"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-green-900 bg-white hover:bg-gray-100 transition-colors duration-200"
            >
              Place Order
            </Link>
            <Link
              to="/track"
              className="ml-4 inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-900 hover:bg-primary-dark transition-colors duration-200"
            >
              Track Your Order
            </Link>
          </div>
        </div>
      </div>
      
      <div className="bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-900 text-white">
                  <Truck className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Fast Delivery</h2>
                <p className="mt-1 text-sm text-gray-500">Fresh from farms within 48 hours</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-900 text-white">
                  <ShoppingBag className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Bulk Orders</h2>
                <p className="mt-1 text-sm text-gray-500">Perfect for restaurants and retailers</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-md bg-green-900 text-white">
                  <Calendar className="h-6 w-6" />
                </div>
              </div>
              <div className="ml-4">
                <h2 className="text-lg font-medium text-gray-900">Seasonal Produce</h2>
                <p className="mt-1 text-sm text-gray-500">Always fresh, always in season</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
