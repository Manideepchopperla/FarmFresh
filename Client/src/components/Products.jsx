import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Banner from '../components/Banner';
import ProductCard from '../components/ProductCard';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const Products = () => {
  const [mockProducts, setMockProducts] = useState([]);
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const user = useSelector(store => store.user.user);

  // Redirect to login if user is not authenticated
  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/products`, { withCredentials: true });
        setMockProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Banner />
      
      <main className="flex-grow bg-gray-50">
        <div className="container mx-auto px-4 py-12">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Fresh Produce</h2>
          </div>
          
          {loading ? ( 
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-700">Loading products...</h3>
              <div className="loader"></div>
            </div>
          ) : mockProducts.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-lg font-medium text-gray-700">No products found</h3>
              <p className="mt-2 text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {mockProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Products;