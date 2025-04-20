
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Search, 
  CheckCircle,
  Clock,
  Truck,
  Package,
  AlertTriangle
} from 'lucide-react';
import axios from 'axios';
import { useSelector } from 'react-redux';


const TrackOrderPage = () => {
  const [mockOrders, setMockOrders] = useState([]);
  const [searchParams] = useSearchParams();
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate()
  const user= useSelector(store=>store.user.user)
  if(!user){
    navigate("/login")
  }
  
  useEffect(() => {

    const fetchProducts = async () => {
      try {
        const response = await axios.get(import.meta.env.VITE_BASE_URL+"/orders/my-orders", { withCredentials: true });
        setMockOrders(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
  
    fetchProducts();

    const orderIdParam = searchParams.get('orderId');
    if (orderIdParam) {
      setOrderId(orderIdParam);
      fetchOrder(orderIdParam);
    }
  }, [searchParams]);
  
  const fetchOrder = (id) => {
    setLoading(true);
    setError('');
    setShowResults(false);
    
    // Simulate API call
    setTimeout(() => {
      const foundOrder = mockOrders.find(o => o.orderId === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
        setShowResults(true);
      } else {
        setError(`No order found with ID: ${id}`);
        setOrder(null);
      }
      
      setLoading(false);
    }, 1000);
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    if (!orderId.trim()) {
      setError('Please enter an order ID');
      return;
    }
    
    fetchOrder(orderId);
  };
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-8 w-8 text-yellow-500" />;
      case 'in_progress':
        return <Truck className="h-8 w-8 text-blue-500" />;
      case 'delivered':
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      default:
        return <Package className="h-8 w-8 text-gray-500" />;
    }
  };
const date = new Date();
date.setDate(date.getDate() + 3);
const formatted =
  String(date.getDate()).padStart(2, '0') + '-' +
  String(date.getMonth() + 1).padStart(2, '0') + '-' +
  date.getFullYear();

  const getStatusClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
            <p className="text-gray-600 mt-2">
              Enter your order ID to check its current status
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
            <form onSubmit={handleSearch} className="mb-8">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400"/>
                  </div>
                  <input
                    type="text"
                    className="block text-black w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-primary focus:border-primary sm:text-sm"
                    placeholder="Enter your order ID (e.g., ORD67874903)"
                    value={orderId}
                    onChange={(e) => setOrderId(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="bg-green-900 hover:bg-primary-dark text-white py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors duration-200"
                >
                  Track Order
                </button>
              </div>
              {error && (
                <div className="mt-3 flex items-center text-red-500">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  <span>{error}</span>
                </div>
              )}
            </form>
            
            {loading ? (
              <div className="text-center py-12">
                <svg className="animate-spin h-8 w-8 text-green-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <p className="mt-3 text-gray-600">Tracking your order...</p>
              </div>
            ) : showResults && order ? (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800">Order #{order.orderId}</h2>
                    <p className="text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
                  </div>
                  <div className={`px-4 py-1 rounded-full border ${getStatusClass(order.status)}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)} {/* Capitalize the first letter */}
                  </div>
                </div>
                
                <div className="mb-8">
                  <div className="relative">
                    <div className="absolute left-0 inset-y-0 w-1 bg-gray-200 rounded"></div>
                    
                    <div className="relative mb-8">
                      <div className="flex items-center">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full ${getStatusClass(order.status)} flex items-center justify-center`}>
                          {getStatusIcon(order.status)}
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium text-gray-800">Order Status</h3>
                          <p className="text-sm text-gray-500">{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Delivery Address</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-800 font-medium">{order.customerName}</p>
                        <p className="text-gray-600">{order.deliveryAddress}</p>
                        <p className="text-gray-600">{order.contactNumber}</p>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Delivery Information</h4>
                      <div className="bg-gray-50 p-3 rounded">
                        <p className="text-gray-600">
                          <span className="font-medium">Expected delivery date:</span> {formatted}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-700 mb-2">Order Items</h4>
                    <div className="bg-gray-50 rounded overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Product
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Quantity
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Price
                            </th>
                            <th scope="col" className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Total
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {order.items.map((item, index) => (
                            <tr key={index}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800">
                                {item.productId.name}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                                {item.quantity} kg
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 text-right">
                                ₹{item.productId.price.toFixed(2)}/kg
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-800 text-right">
                                ₹{(item.productId.price * item.quantity).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                        <tfoot>
                          <tr className="bg-gray-50">
                            <td colSpan="3" className="px-4 py-3 text-right text-sm font-medium text-gray-700">
                              Order Total:
                            </td>
                            <td className="px-4 py-3 text-right text-sm font-bold text-green-900">
                              ₹{order.totalAmount.toFixed(2)}
                            </td>
                          </tr>
                        </tfoot>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              !loading && !error && (
                <div className="text-center py-12 border border-dashed border-gray-300 rounded-lg">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-1">No Order Found</h3>
                  <p className="text-gray-500">
                    Enter your order ID above to track your order status
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default TrackOrderPage;
