import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { CheckCircle, Clock, AlertTriangle, Truck, X } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const UserPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const navigate = useNavigate();
  const user = useSelector(store => store.user.user);

  if (!user) {
    navigate("/login");
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get(import.meta.env.VITE_BASE_URL + '/orders/my-orders', { withCredentials: true });
      setOrders(response.data);
    } catch (error) {
      setError('Failed to fetch orders');
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const date = new Date();
  date.setDate(date.getDate() + 3);
  const formatted =
    String(date.getDate()).padStart(2, '0') + '-' +
    String(date.getMonth() + 1).padStart(2, '0') + '-' +
    date.getFullYear();

  const todayDate = new Date();
  const formattedToday =
    String(todayDate.getDate()).padStart(2, '0') + '-' +
    String(todayDate.getMonth() + 1).padStart(2, '0') + '-' +
    todayDate.getFullYear();

  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setOrderModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800">My Orders</h1>
          {loading ? (
            <div className="text-center py-12">
              <svg className="animate-spin h-8 w-8 text-green-900 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p className="mt-3 text-gray-600">Loading your orders...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <AlertTriangle className="h-12 w-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-1">{error}</h3>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md overflow-x-auto p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                {orders && orders.length > 0 ? (
                    orders.map((order) => (
                      <tr key={order.orderId} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">₹{order.totalAmount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium 
                            ${order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              order.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                              'bg-green-100 text-green-800'}`}>
                            {order.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                            {order.status === 'in_progress' && <Truck className="h-3 w-3 mr-1" />}
                            {order.status === 'delivered' && <CheckCircle className="h-3 w-3 mr-1" />}
                            {order.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          <button 
                            onClick={() => handleViewDetails(order)} 
                            className="text-green-900 hover:text-green-700">
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center py-6 text-gray-500">
                        No orders found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Order Details Modal */}
      {orderModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Order #{selectedOrder.orderId}</h2>
                <button
                  className="text-gray-400 hover:text-gray-500"
                  onClick={() => {
                    setOrderModalOpen(false);
                    setSelectedOrder(null);
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Order details content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Customer Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="font-medium text-gray-700">{selectedOrder.customerName}</p>
                    <p className="text-gray-600">{selectedOrder.contactNumber}</p>
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <p className="font-medium text-gray-700">Delivery Address</p>
                      <p className="text-gray-600">{selectedOrder.deliveryAddress}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-gray-800 mb-2">Order Details</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-medium text-gray-700">Status</p>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium 
                        ${selectedOrder.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                          selectedOrder.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                                                {selectedOrder.status === 'pending' && <Clock className="h-3 w-3 mr-1" />}
                        {selectedOrder.status === 'in_progress' && <Truck className="h-3 w-3 mr-1" />}
                        {selectedOrder.status === 'delivered' && <CheckCircle className="h-3 w-3 mr-1" />}
                        {selectedOrder.status}
                      </span>
                    </div>
                    <div className="flex justify-between mb-3">
                      <p className="text-gray-600">Delivery Date</p>
                      <p className="font-medium text-gray-700">{selectedOrder.status === "delivered" ? formattedToday : formatted}</p>
                    </div>
                    <div className="flex justify-between mb-3">
                      <p className="text-gray-600">Total Items</p>
                      <p className="font-medium text-gray-700">{selectedOrder.items.length}</p>
                    </div>
                    <div className="flex justify-between mb-3">
                      <p className="text-gray-600">Order Total</p>
                      <p className="font-medium text-gray-700">₹{selectedOrder.totalAmount.toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Order Items</h3>
                <div className="bg-gray-50 rounded-lg overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">{item.productId.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">{item.quantity} kg</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-right">₹{item.productId.price.toFixed(2)}/kg</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800 text-right">₹{(item.productId.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="bg-gray-50">
                        <td colSpan="3" className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700 text-right">Total</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-900 text-right">₹{selectedOrder.totalAmount.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>

              <div className="flex flex-wrap justify-end gap-3 border-t border-gray-200 pt-6">
                <button
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={() => {
                    setOrderModalOpen(false);
                    setSelectedOrder(null);
                  }}
                >
                  Close
                </button>
                {/* Uncomment the following buttons if you want to allow status updates */}
                {/* {selectedOrder.status === 'pending' && (
                  <button
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, 'in_progress')}
                  >
                    Mark as In Progress
                                    </button>
                )}
                {selectedOrder.status === 'in_progress' && (
                  <button
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    onClick={() => handleUpdateOrderStatus(selectedOrder.orderId, 'delivered')}
                  >
                    Mark as Delivered
                  </button>
                )} */}
              </div>
            </div>
          </div>
        </div>
        )}
      </div>
  );
};

export default UserPage;